import express from 'express';
const router = express.Router();
//import CartManager from '../dao/fileSystem/CartManager.js';
//const cartManager = new CartManager('Carts.json');
import cartsDao from '../dao/cartsDao.js';

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    //const cart = cartManager.getCartById(cartId);
    const cart = await cartsDao.getCartById(cartId);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

router.post('/', async (req, res) => {
    //const newCart = cartManager.addCart();
    const newCart = await cartsDao.addCart();
    //res.status(201).json(newCart);
    if (newCart) {
        res.status(201).json(newCart);
    } else {
        res.status(400).json({ error: 'Error al crear el carrito' });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    //cartManager.addProductToCart(cartId, productId);
    //res.json({ message: "Producto añadido al carrito correctamente" });
    const result = await cartsDao.addProductToCart(cartId, productId);
    if (result) {
        res.json({ message: "Producto añadido al carrito correctamente" });
    } else {
        res.status(404).json({ error: "No se pudo añadir el producto al carrito" });
    }
});


router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const result = await cartsDao.removeProductFromCart(cid, pid);
    if (result) {
        res.json({ message: "Producto eliminado del carrito correctamente" });
    } else {
        res.status(404).json({ error: "No se pudo eliminar el producto del carrito" });
    }
});

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const productsToUpdate = req.body;
    const result = await cartsDao.updateCartProducts(cartId, productsToUpdate);
    if (result) {
        res.json({ message: "Carrito actualizado correctamente" });
    } else {
        res.status(404).json({ error: "No se pudo actualizar el carrito" });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await cartsDao.updateProductQuantityInCart(cid, pid, quantity);
    if (result) {
        res.json({ message: "Cantidad del producto actualizada correctamente en el carrito" });
    } else {
        res.status(404).json({ error: "No se pudo actualizar la cantidad del producto en el carrito" });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    const result = await cartsDao.clearCart(cid);
    if (result) {
        res.json({ message: "Todos los productos han sido eliminados del carrito" });
    } else {
        res.status(404).json({ error: "No se pudieron eliminar los productos del carrito" });
    }
});

export default router;

