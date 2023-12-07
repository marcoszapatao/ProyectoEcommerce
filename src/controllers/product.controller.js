import productsDao from '../dao/productsDao.js'; 
import Product from '../dao/models/products.model.js';

export const getAllProducts = async (req, res) => {
    const products = await productsDao.getAllProducts();
    res.render('realTimeProducts', { products });
};

export const getProducts = async (req, res) => {
    const { limit = 10, page = 1, sort, query, category, available } = req.query;
  
    let sortOptions = {};
    if (sort === 'asc') sortOptions.price = 1;
    if (sort === 'desc') sortOptions.price = -1;
  
    let filterOptions = {};
    if (query) filterOptions.title = { $regex: query, $options: 'i' };
    if (category) filterOptions.category = category;
    if (available) filterOptions.available = available === 'true';
  
    try {
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: sortOptions,
        lean: true
      };
  
      const queryParams = new URLSearchParams();
      queryParams.append('limit', options.limit);
      if (sort) queryParams.append('sort', sort);
      if (query) queryParams.append('query', query);
      if (category) queryParams.append('category', category);
      if (available) queryParams.append('available', available);
    
      const path = '/products';
  
      const result = await Product.paginate(filterOptions, options);
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const user = req.user.toObject();
      res.render('products' ,{ user,
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `${baseUrl}${path}?${queryParams.toString()}&page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `${baseUrl}${path}?${queryParams.toString()}&page=${result.nextPage}` : null
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
};


export const getProductById = async (req, res) => {
    const productId = req.params.pid;
    const product = await productsDao.getProductById(productId); 
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
};

export const addProduct = async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    const newProduct = await productsDao.addProduct({ title, description, code, price, stock, category, thumbnails });
    if(newProduct){
        res.json({ message: 'Producto agregado exitosamente.', product: newProduct });
    } else {
        res.status(400).json({ error: 'Error al agregar producto' });
    }
};

export const updateProduct = async (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedProductData = req.body;
    const result = await productsDao.updateProduct(productId, updatedProductData);
    if(result){
        res.json({ message: 'Producto actualizado exitosamente.' });
    } else {
        res.status(404).json({ error: 'Producto no encontrado para actualizar' });
    }
};


export const deleteProduct = async (req, res) => {
    const productId = parseInt(req.params.pid);
    const result = await productsDao.deleteProduct(productId);
    if(result){
        res.json({ message: `Producto con ID: ${productId} ha sido eliminado.` });
    } else {
        res.status(404).json({ error: 'Producto no encontrado para eliminar' });
    }
};