export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    addCart = async () => { return await this.dao.addCart() }
    getCartById = async (id) => { return await this.dao.getCartById(id) }
    addProductToCart = async (cartId, productId) => { return await this.dao.addProductToCart(cartId, productId) }
    removeProductFromCart = async (cartId, productId) => { return await this.dao.removeProductFromCart(cartId, productId) }
    clearCart = async (cartId) => { return await this.dao.clearCart(cartId) }
    updateProductQuantityInCart = async (cartId, productId, quantity) => { return await this.dao.updateProductQuantityInCart(cartId, productId, quantity) }
    updateCartProducts = async (cartId, productsToUpdate) => { return await this.dao.updateCartProducts(cartId, productsToUpdate) }

}