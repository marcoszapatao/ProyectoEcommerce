/*Entregable Proyecto Ecommerce
Autor: Marcos Zapata Otárola
*/

import fs from 'fs';

export default class ProductManager{

    constructor(path){
        this.path= path;
        this.products = this.getProducts();
        this.productId = this.getNextProductId();
    }

    getNextProductId() {
      const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
      return maxId + 1;
    }
    
   
    addProduct({ title, description, code, price, stock, category, thumbnails }) {
    
    if (!title || !description || !code || !price || !stock || !category) {      
      console.error("Todos los campos son obligatorios.");
      return;
    }
      
    const codeExists = this.products.some(product => product.code === code);
    if (codeExists) {
      console.error("El código del producto ya existe.");
      return;
    }

    const product = {
      id: this.productId,
      title,
      description,
      code,
      price,
      stock,
      category,
      status: true,  // Por defecto es true
      thumbnails: thumbnails || []
    };
    this.products.push(product);
    this.writeFile(this.products);
    console.log("Producto con ID: "+ this.productId +" se ha creado correctamente");
    this.productId++;
    return product;
  }
  
  getProducts() {
    try{
        return JSON.parse(fs.readFileSync(this.path, 'utf-8')) || []; 
    }catch(error){
        return [];
    }
  }
  
  getProductById(id) {
    const allProducts = this.getProducts();
    if (allProducts.length === 0) {
        return [];
    }
    const product = allProducts.find(product => product.id === id);
    if (product) {
      return product;
    } else {
      console.error("NOT FOUND");
    }
  }

  updateProduct(id, updatedProduct) {
    const allProducts = this.getProducts();
    const productIndex = allProducts.findIndex(product => product.id === id);
    if (productIndex === -1) {
        console.error("Producto no encontrado.");
        return;
    }
    delete updatedProduct.id;
    const updatedProductId = { id, ...updatedProduct };
    allProducts[productIndex] = updatedProductId;
    this.writeFile(allProducts);
    console.log('Producto se ha actualizado correctamente');
  }

  deleteProduct(id) {
    const numericId = parseInt(id, 10);
    const allProducts = this.getProducts();
    const updatedProducts = allProducts.filter(product => product.id !== numericId);
    if (updatedProducts.length === allProducts.length) {
      console.error("Producto no encontrado.");
      return;
    }  
    this.writeFile(updatedProducts);
    console.log(`Producto se ha eliminado correctamente.`);
  }

  writeFile (products){
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2), 'utf-8');
  }
 

 
 }


