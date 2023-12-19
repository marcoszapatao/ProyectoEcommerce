import Cart from './models/carts.model.js';

export default class CartsDao {
    async addCart() {
        try {
            let newCart = new Cart();
            newCart = await newCart.save();
            console.log("Carrito con ID: " + newCart._id + " se ha creado correctamente");
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            return null;
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findById(id).populate('products.product');
            return cart || null;
        } catch (error) {
            console.error("Carrito no encontrado:", error);
            return null;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.error("Carrito no encontrado");
                return null;
            }

            const productIndex = cart.products.findIndex(p => p.product._id.equals(productId));

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al añadir producto al carrito:", error);
            return null;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.error("Carrito no encontrado");
                return null;
            }

            cart.products = cart.products.filter(p => !p.product._id.equals(productId));
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al remover producto del carrito:", error);
            return null;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.error("Carrito no encontrado");
                return null;
            }

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            return null;
        }
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.error("Carrito no encontrado");
                return null;
            }
            const productIndex = cart.products.findIndex(p => p.product._id.equals(productId));   
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = Math.max(quantity, 1);
            } else {
                console.error("Producto no encontrado en el carrito");
                return null;
            }
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            return null;
        }
    }


    async updateCartProducts(cartId, productsToUpdate) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.error("Carrito no encontrado");
                return null;
            }
            cart.products = productsToUpdate.map(product => ({
                product: product._id,
                quantity: product.quantity
            }));
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar los productos en el carrito:", error);
            return null;
        }
    }

}

//export default new CartsDao();
