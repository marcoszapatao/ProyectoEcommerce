import Product from './models/products.model.js';

 class ProductsDao {
  async addProduct({ title, description, code, price, stock, category, thumbnails }) {
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

  // async getAllProductsPag({  limit = 10, page = 1 }) {
  //   try {
  //     return await Product.find({}).lean().paginate({}, { page, limit, lean:true });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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
}

export default new ProductsDao();