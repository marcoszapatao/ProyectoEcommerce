import cartsDao from '../dao/cartsDao.js';
import CartRepository from '../services/carts.repository.js';
import userDao from '../dao/usersDao.js';
import userRepository from '../services/users.repository.js';
import productDao from '../dao/productsDao.js';
import productRepository from '../services/products.repository.js';
import ticketDao from '../dao/ticketsDao.js';
import ticketRepository from '../services/tickets.repository.js';
import nodemailer from 'nodemailer';
import config from '../config/config.js';

const CartService = new CartRepository(new cartsDao())
const UserService = new userRepository(new userDao())
const ProductService = new productRepository(new productDao())
const TicketService = new ticketRepository(new ticketDao())

//const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export const getCartById = async (req, res) => {
    const cartId = req.params.cid;
    const cart = await CartService.getCartById(cartId);
    if (cart) {
        const total = await calculateCartTotal(cartId);
        res.render('carts', { cart: cart.toObject(), total: total });;
        //res.json(cart.toObject());
    } else {
        res.status(404).render('error', { error: 'Carrito no encontrado' });
    }
};

// Función para calcular el total del carrito
export const calculateCartTotal = async (cartId) => {
    try {
        const cart = await CartService.getCartById(cartId);
        console.log('Carrito en controller',cart);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        let total = 0;
        for (const item of cart.products) {
            const product = item.product;
            const quantity = item.quantity;
            const productDetails = await ProductService.getProductById(product._id);
            const productPrice = productDetails.price;

            total += productPrice * quantity;
        }
        return total;
    } catch (error) {
        throw new Error(`Error al calcular el total del carrito: ${error.message}`);
    }
};

export const addCart = async (req, res) => {
    const newCart = await CartService.addCart();
    if (newCart) {
        res.status(201).json(newCart);
    } else {
        res.status(400).json({ error: 'Error al crear el carrito' });
    }
};

export const addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const result = await CartService.addProductToCart(cartId, productId);
    if (result) {
        res.json({ message: "Producto añadido al carrito correctamente" });
    } else {
        res.status(404).json({ error: "No se pudo añadir el producto al carrito" });
    }
};

export const addProductToCartWithoutCartID = async (req, res) => {
    const productId = req.params.pid;
    const userId = req.user._id;
    const user = await UserService.getUserById(userId);
    if (!user || !user.cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const cartId = user.cart._id;
    const result = await CartService.addProductToCart(cartId, productId);
    if (result) {
        res.json({ message: "Producto añadido al carrito correctamente" });
    } else {
        res.status(404).json({ error: "No se pudo añadir el producto al carrito" });
    }
};

export const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    const result = await CartService.removeProductFromCart(cid, pid);
    if (result) {
        res.json({ message: "Producto eliminado del carrito correctamente" });
    } else {
        res.status(404).json({ error: "No se pudo eliminar el producto del carrito" });
    }
};

export const updateCartProducts = async (req, res) => {
    const cartId = req.params.cid;
    const productsToUpdate = req.body;
    const result = await CartService.updateCartProducts(cartId, productsToUpdate);
    if (result) {
        res.json({ message: "Carrito actualizado correctamente" });
    } else {
        res.status(404).json({ error: "No se pudo actualizar el carrito" });
    }
};

export const updateProductQuantityInCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await CartService.updateProductQuantityInCart(cid, pid, quantity);
    if (result) {
        res.json({ message: "Cantidad del producto actualizada correctamente en el carrito" });
    } else {
        res.status(404).json({ error: "No se pudo actualizar la cantidad del producto en el carrito" });
    }
};


export const clearCart = async (req, res) => {
    const { cid } = req.params;
    const result = await CartService.clearCart(cid);
    if (result) {
        res.json({ message: "Todos los productos han sido eliminados del carrito" });
    } else {
        res.status(404).json({ error: "No se pudieron eliminar los productos del carrito" });
    }
};

// Configuración del transporter para Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.MAIL,
        pass: config.PASSMAIL
    }
});

export const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    const cart = await CartService.getCartById(cartId);
    let totalAmount = 0;
    const userId = req.user._id;
    const user = await UserService.getUserById(userId);
    const email = user.email;
    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }
    const products = cart.products;
    let successfulProducts = [];
    let failedProducts = [];
    for (const item of products) {
        if (item.quantity <= item.product.stock) {
           successfulProducts.push(item.product._id);
           await ProductService.updateProductStock(item.product._id, item.product.stock - item.quantity);
           totalAmount += item.product.price * item.quantity;
        } else {
          failedProducts.push({ _id: item.product._id, quantity: item.quantity });
        }
    }

    const ticketData = {
        amount: totalAmount,
        purchaser: email
    };
    if (failedProducts.length < cart.products.length) {
        await CartService.updateCartProducts(cartId, failedProducts);
    }

    const ticket = await TicketService.createTicket(ticketData);

    const mailOptions = {
        from: config.MAIL,
        to: email,
        subject: 'Detalle del Ticket de Compra',
        text: `Aquí está el detalle de tu ticket de compra:\n\nNúmero de Ticket: ${ticket._id}\nMonto: ${ticket.amount}\n\nGracias por tu compra.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
        } else {
            console.log('Correo electrónico enviado:', info.response);
        }
    });

    if (failedProducts.length > 0) {
        return res.status(400).json({ error: "Productos no disponibles", ids: failedProducts });
    } else {
        return res.json({ message: "Compra completada con éxito", ticket: ticket});
    }
};


// export const paymentCart = async (req, res) => {
//     const cartId = req.params.cid;
//     const cart = await CartService.getCartById(cartId);
//     if (!cart) {
//         return res.status(404).json({ error: "Carrito no encontrado" });
//     }
//     const total = await calculateCartTotal(cartId);

//     const data = {
//         amount: total,
//         currency: 'usd',
//         payment_method_types: ['card']
//     }

//     try {
//         const paymentIntent  = await stripe.paymentIntents.create(data);
//         console.log("ACA IMPRIMO EL PAYMENT INTENT: ",{ paymentIntent  });
//         res.json({ clientSecret: paymentIntent.client_secret });
//         //res.send({ status: 'success', payload: result })
//         //res.render('paymentForm'); 
//     } catch (error) {
//         console.error('Error al iniciar el pago:', error);
//         res.status(500).json({ error: "Error al iniciar el pago" });
//     }
// }

// export const processPayment = async (req, res) => {
//     const cartId = req.params.cid;
//     const { cardNumber, expiryDate, cvc, amount, currency } = req.body;

//     try {
//         const paymentIntentId = req.body.paymentIntentId;
//         const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
//             payment_method_data: {
//                 card: {
//                     number: cardNumber,
//                     exp_month: expiryDate.month,
//                     exp_year: expiryDate.year,
//                     cvc: cvc
//                 }
//             }
//         });
//         // - Actualizar el estado del pedido a "Pagado"
//         // - Enviar un correo electrónico de confirmación al usuario
//         // - Redirigir al usuario a una página de éxito de pago
//         res.status(200).json({ message: 'Pago completado con éxito' });
//     } catch (error) {
//         console.error('Error al procesar el pago:', error);
//         res.status(500).json({ error: 'Error al procesar el pago' });
//     }
// }