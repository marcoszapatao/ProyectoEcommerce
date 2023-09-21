/*Entregable Clase Manejo de Archivos
Autor: Marcos Zapata Otárola
Fecha: 15-09-2023
*/

const fs = require('fs');

class ProductManager{

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

 
