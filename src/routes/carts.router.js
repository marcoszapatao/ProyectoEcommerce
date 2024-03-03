import express from 'express';
import passport from 'passport';
const router = express.Router();
import { getCartById, addCart, addProductToCart, removeProductFromCart, updateCartProducts, updateProductQuantityInCart, clearCart, addProductToCartWithoutCartID, purchaseCart} from '../controllers/carts.controller.js';
import authorize from '../authMiddleware.js';

router.get('/:cid', passport.authenticate('jwt', { session: false }), getCartById);
router.post('/', addCart);
router.post('/:cid/product/:pid', authorize('user'),addProductToCart);
router.delete('/:cid/product/:pid', removeProductFromCart);
router.put('/:cid', updateCartProducts);
router.put('/:cid/product/:pid', updateProductQuantityInCart);
router.delete('/:cid', clearCart);

router.post('/add-product/:pid', passport.authenticate('jwt', { session: false }), addProductToCartWithoutCartID);
router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), purchaseCart)
//router.post('/:cid/payment-intents', passport.authenticate('jwt', { session: false }), paymentCart)
//router.post('/:cid/process-payment', passport.authenticate('jwt', { session: false }), processPayment)

export default router;

