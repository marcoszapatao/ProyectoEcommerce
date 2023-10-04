import fs from 'fs';

export default class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = this.getCarts();
        this.cartId = this.getNextCartId();
    }

    getNextCartId() {
        const maxId = this.carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);
        return maxId + 1;
    }

    addCart() {
        const cart = {
            id: this.cartId,
            products: []
        };
        this.carts.push(cart);
        this.writeFile(this.carts);
        console.log("Carrito con ID: " + this.cartId + " se ha creado correctamente");
        this.cartId++;
        return cart;
    }

    getCarts() {
        try {
            return JSON.parse(fs.readFileSync(this.path, 'utf-8')) || [];
        } catch (error) {
            return [];
        }
    }

    getCartById(id) {
        const cart = this.carts.find(cart => cart.id === id);
        if (cart) {
            return cart;
        } else {
            console.error("Carrito no encontrado");
            return null;
        }
    }

    addProductToCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            console.error("Carrito no encontrado");
            return null;
        }
        const productInCart = cart.products.find(p => p.product === productId);
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }
        this.updateCart(cart);
        this.writeFile(this.carts); 
    }

    updateCart(updatedCart) {
        const cartIndex = this.carts.findIndex(cart => cart.id === updatedCart.id);
        if (cartIndex !== -1) {
            this.carts[cartIndex] = updatedCart;
        }
    }

    writeFile(carts) {
        fs.writeFileSync(this.path, JSON.stringify(carts, null, 2), 'utf-8');
    }
}
