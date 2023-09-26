/*Entregable Clase Manejo de Archivos
Autor: Marcos Zapata Otárola
Fecha: 15-09-2023
*/

//const fs = require('fs');
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
    
   
    addProduct(title, description, price, thumbnail, code, stock) {
    
    if (!title || !description || !price || !thumbnail || !stock || !code) {
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
      price,
      thumbnail,
      code,
      stock
    };
    this.products.push(product);
    this.writeFile(this.products);
    console.log("Producto con ID: "+ this.productId +" se ha creado correctamente");
    this.productId++;
 
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
    if (productIndex === 'NOT FOUND') {
        console.error("Producto no encontrado.");
        return;
    }
    const updatedProductId = { id, ...updatedProduct };
    allProducts[productIndex] = updatedProductId;
    this.writeFile(allProducts);
    console.log('Producto se ha actualizado correctamente');
  }

  deleteProduct(id) {
    const allProducts = this.getProducts();
    const updatedProducts = allProducts.filter(product => product.id !== id);
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

//  const productManager = new ProductManager('Products.json');
//  productManager.addProduct("Pantalon", "Pantalon de manga corta", 100, "https://cdn3.iconfinder.com/data/icons/fashion-and-clothing-3/512/pantalon_manga_corta-512", "123", 100);
//  productManager.addProduct("Camisa", "Camisa de manga larga", 200, "https://cdn3.iconfinder.com/data/icons/fashion-and-clothing-3/512/camisa_manga_larga-512", "456", 100);
//  productManager.addProduct("Zapatillas", "Zapatillas de cuero", 300, "https://cdn3.iconfinder.com/data/icons/fashion-and-clothing-3/512/zapatillas_cuero-512", "789", 100);
//  productManager.addProduct("Zapatos", "Zapatos de Cuero", 300, "https://cdn3.iconfinder.com/data/icons/fashion-and-clothing-3/512/zapatillas_cuero-512", "654", 100);
//  productManager.addProduct("Hoddie", "Hoddie TNF", 300, "https://cdn3.iconfinder.com/data/icons/fashion-and-clothing-3/512/zapatillas_cuero-512", "321", 100);
//  productManager.addProduct("Buzo", "Pantalon jogger", 100, "https://cdn3.iconfinder.com/data/icons/fashion-and-clothing-3/512/pantalon_manga_corta-512", "143", 50);
//  productManager.addProduct("Polera", "Polera manga larga", 200, "https://cdn3.iconfinder.com/data/icons/fashion-and-clothing-3/512/camisa_manga_larga-512", "444", 50);
//  productManager.addProduct("Zapatillas Nike", "Zapatillas blancas", 300, "https://cdn3.iconfinder.com/data/icons/fashion-and-clothing-3/512/zapatillas_cuero-512", "540", 50);
//  productManager.addProduct("Cinturon", "Cinturon de Cuero", 300, "https://cdn3.iconfinder.com/data/icons/fashion-and-clothing-3/512/zapatillas_cuero-512", "876", 50);
//  productManager.addProduct("Calcetin", "Calcetin TNF", 300, "https://cdn3.iconfinder.com/data/icons/fashion-and-clothing-3/512/zapatillas_cuero-512", "999", 50);
