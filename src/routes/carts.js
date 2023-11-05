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

export default router;

