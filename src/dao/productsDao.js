import Product from './models/products.model.js';

export default class ProductsDao {
  
  addProduct = async ({ title, description, code, price, stock, category, thumbnails }) => {
    try {
      const productExists = await Product.findOne({ code });
      if (productExists) {
        throw new Error("El código del producto ya existe.");
      }

      const product = new Product({
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails: thumbnails || []
      });

      await product.save();
      console.log("Producto se ha creado correctamente.");
      return product;
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts() {
    return await Product.find({}).lean();
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Producto no encontrado.");
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, updateData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedProduct) {
        throw new Error("Producto no encontrado.");
      }
      console.log('Producto se ha actualizado correctamente');
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        throw new Error("Producto no encontrado.");
      }
      console.log(`Producto se ha eliminado correctamente.`);
      return deletedProduct;
    } catch (error) {
      throw error;
    }
  }

  async updateProductStock(id, stock) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, { stock }, { new: true });
      if (!updatedProduct) {
        throw new Error("Producto no encontrado.");
      }
      console.log('Stock del producto actualizado correctamente');
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }
}



//export default new ProductsDao();