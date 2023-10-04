import express from 'express';
import ProductManager from '../src/ProductManager.js'; 
import CartManager from '../src/CartManager.js'; 
import productRoutes from './routes/products.js';
import cartRoutes from './routes/carts.js';

const app = express();
const server = app.listen(8080,()=>console.log('listening on port 8080'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productManager = new ProductManager('Products.json');
const cartManager = new CartManager('Carts.json');

app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
