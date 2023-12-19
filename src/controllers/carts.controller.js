import cartsDao from '../dao/cartsDao.js';
import CartRepository from '../services/carts.repository.js';

const ProductService = new CartRepository(new cartsDao())

export const getCartById = async (req, res) => {
    const cartId = req.params.cid;
    const cart = await ProductService.getCartById(cartId);
    if (cart) {
        res.render('carts', { cart: cart.toObject() });;
    } else {
        res.status(404).render('error', { error: 'Carrito no encontrado' });
    }
};

export const addCart = async (req, res) => {
    const newCart = await ProductService.addCart();
    if (newCart) {
        res.status(201).json(newCart);
    } else {
        res.status(400).json({ error: 'Error al crear el carrito' });
    }
};

export const addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const result = await ProductService.addProductToCart(cartId, productId);
    if (result) {
        res.json({ message: "Producto añadido al carrito correctamente" });
    } else {
        res.status(404).json({ error: "No se pudo añadir el producto al carrito" });
    }
};

export const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    const result = await ProductService.removeProductFromCart(cid, pid);
    if (result) {
        res.json({ message: "Producto eliminado del carrito correctamente" });
    } else {
        res.status(404).json({ error: "No se pudo eliminar el producto del carrito" });
    }
};

export const updateCartProducts = async (req, res) => {
    const cartId = req.params.cid;
    const productsToUpdate = req.body;
    const result = await ProductService.updateCartProducts(cartId, productsToUpdate);
    if (result) {
        res.json({ message: "Carrito actualizado correctamente" });
    } else {
        res.status(404).json({ error: "No se pudo actualizar el carrito" });
    }
};

export const updateProductQuantityInCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await ProductService.updateProductQuantityInCart(cid, pid, quantity);
    if (result) {
        res.json({ message: "Cantidad del producto actualizada correctamente en el carrito" });
    } else {
        res.status(404).json({ error: "No se pudo actualizar la cantidad del producto en el carrito" });
    }
};


export const clearCart = async (req, res) => {
    const { cid } = req.params;
    const result = await ProductService.clearCart(cid);
    if (result) {
        res.json({ message: "Todos los productos han sido eliminados del carrito" });
    } else {
        res.status(404).json({ error: "No se pudieron eliminar los productos del carrito" });
    }
};