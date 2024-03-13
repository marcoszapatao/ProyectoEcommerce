import express from 'express';
import passport from 'passport';
const router = express.Router();
import { isLoggedIn } from '../isLoggedIn.js';
import { getAllProducts, getProducts , getProductById, addProduct, updateProduct, deleteProduct} from '../controllers/product.controller.js';
import authorize from '../authMiddleware.js';

router.get('/realtimeproducts', passport.authenticate('jwt', { session: false }), authorize('admin'), getAllProducts);
//router.get('/' ,isLoggedIn, getProducts);
router.get('/' , getProducts);
router.get('/:pid', getProductById);
router.post('/', authorize('admin'), addProduct);
router.put('/:pid', authorize('admin'), updateProduct);
router.delete('/:pid', authorize('admin'), deleteProduct);

export default router;
