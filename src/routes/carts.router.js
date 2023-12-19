import express from 'express';
const router = express.Router();
import { getCartById, addCart, addProductToCart, removeProductFromCart, updateCartProducts, updateProductQuantityInCart, clearCart} from '../controllers/carts.controller.js';

router.get('/:cid', getCartById);
router.post('/', addCart);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/product/:pid', removeProductFromCart);
router.put('/:cid', updateCartProducts);
router.put('/:cid/product/:pid', updateProductQuantityInCart);
router.delete('/:cid', clearCart);

export default router;

