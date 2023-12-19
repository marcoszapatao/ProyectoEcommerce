export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    addProduct = async ({ title, description, code, price, stock, category, thumbnails }) => { 
        return await this.dao.addProduct({ title, description, code, price, stock, category, thumbnails }) }
    
    getAllProducts = async () => { return await this.dao.getAllProducts() }
    getProductById = async (id) => { return await this.dao.getProductById(id) }
    updateProduct = async (id, updateData) => { return await this.dao.updateProduct(id, updateData) }
    deleteProduct = async (id) => { return await this.dao.deleteProduct(id) }


}