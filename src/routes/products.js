import express from 'express';
const router = express.Router();
import ProductManager from '../ProductManager.js'; 

const productManager = new ProductManager('Products.json');

router.get('/', (req, res) => { 
    const limit = req.query.limit;
    let products = productManager.getProducts();
    if (limit && !isNaN(limit)) {
        products = products.slice(0, Number(limit)); 
    }
    res.json({products});
});

router.get('/:pid', (req, res) => { 
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    productManager.addProduct({ title, description, code, price, stock, category, thumbnails });
    res.json({ message: 'Producto agregado exitosamente.' });
});

router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;
    productManager.updateProduct(productId, updatedProduct);
    res.json({ message: 'Producto actualizado exitosamente.' });

});

router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    productManager.deleteProduct(productId);
    res.json({ message: `Producto con ID: ${productId} ha sido eliminado.` });
});


export default router;
