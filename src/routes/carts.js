import express from 'express';
const router = express.Router();
import CartManager from '../CartManager.js';
const cartManager = new CartManager('Carts.json');


router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

router.post('/', (req, res) => {
    const newCart = cartManager.addCart();
    res.status(201).json(newCart);
});


router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    cartManager.addProductToCart(cartId, productId);
    res.json({ message: "Producto añadido al carrito correctamente" });
});

export default router;

