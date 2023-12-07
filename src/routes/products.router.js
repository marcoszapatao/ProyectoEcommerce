import express from 'express';
const router = express.Router();
import { isLoggedIn } from '../isLoggedIn.js';
import { getAllProducts, getProducts , getProductById, addProduct, updateProduct, deleteProduct} from '../controllers/product.controller.js';

router.get('/realtimeproducts', getAllProducts);
router.get('/' ,isLoggedIn, getProducts);
router.get('/:pid', getProductById);
router.post('/', addProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);



export default router;
