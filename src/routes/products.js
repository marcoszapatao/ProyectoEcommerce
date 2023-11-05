import express from 'express';
const router = express.Router();
//import ProductManager from '../dao/fileSystem/ProductManager.js'; 
import productsDao from '../dao/productsDao.js'; 

//const productManager = new ProductManager('Products.json');

router.get('/', async (req, res) => { 
    //const products = productManager.getProducts();
    const products = await productsDao.getAllProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    //const products = productManager.getProducts();
    const products = await productsDao.getAllProducts();
    res.render('realTimeProducts', { products });
});

router.get('/', async (req, res) => { 
    const limit = req.query.limit;
    //let products = productManager.getProducts();
    let products = await productsDao.getAllProducts();
    if (limit && !isNaN(limit)) {
        products = products.slice(0, Number(limit)); 
    }
    res.json({products});
});

router.get('/:pid', async (req, res) => { 
    const productId = parseInt(req.params.pid);
    //const product = productManager.getProductById(productId);
    const product = await productsDao.getProductById(productId);	
    if (product) {
      res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    //productManager.addProduct({ title, description, code, price, stock, category, thumbnails });
    const newProduct = await productsDao.addProduct({ title, description, code, price, stock, category, thumbnails });
    //res.json({ message: 'Producto agregado exitosamente.' });
    if(newProduct){
        res.json({ message: 'Producto agregado exitosamente.', product: newProduct });
    } else {
        res.status(400).json({ error: 'Error al agregar producto' });
    }
});

router.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;
    //productManager.updateProduct(productId, updatedProduct);
    //res.json({ message: 'Producto actualizado exitosamente.' });
    const result = await productsDao.updateProduct(productId, updatedProduct);
    if(result){
        res.json({ message: 'Producto actualizado exitosamente.' });
    } else {
        res.status(404).json({ error: 'Producto no encontrado para actualizar' });
    }

});

router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    //productManager.deleteProduct(productId);
    //res.json({ message: `Producto con ID: ${productId} ha sido eliminado.` });
    const result = await productsDao.deleteProduct(productId);
    if(result){
        res.json({ message: `Producto con ID: ${productId} ha sido eliminado.` });
    } else {
        res.status(404).json({ error: 'Producto no encontrado para eliminar' });
    }
});



export default router;
