import express from 'express';
import ProductManager from '../src/ProductManager.js'; 
const app = express();
const server = app.listen(8080,()=>console.log('listening on port 8080'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productManager = new ProductManager('Products.json');


app.get('/products', (req,res)=>{
    const limit = req.query.limit;
    let products = productManager.getProducts();
    if (limit && !isNaN(limit)) {
        products = products.slice(0, Number(limit)); 
    }
    res.json({products});
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});