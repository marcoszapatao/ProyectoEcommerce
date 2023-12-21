import express from 'express';
import passport from 'passport';
const router = express.Router();
import { getCartById, addCart, addProductToCart, removeProductFromCart, updateCartProducts, updateProductQuantityInCart, clearCart, addProductToCartWithoutCartID} from '../controllers/carts.controller.js';
import authorize from '../authMiddleware.js';

router.get('/:cid', getCartById);
router.post('/', addCart);
router.post('/:cid/product/:pid', authorize('user'),addProductToCart);
router.delete('/:cid/product/:pid', removeProductFromCart);
router.put('/:cid', updateCartProducts);
router.put('/:cid/product/:pid', updateProductQuantityInCart);
router.delete('/:cid', clearCart);

router.post('/add-product/:pid', passport.authenticate('jwt', { session: false }), addProductToCartWithoutCartID);

export default router;

