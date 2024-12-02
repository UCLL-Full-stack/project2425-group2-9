
import { CartContainsProduct as cartContainsProductPrisma } from "@prisma/client";
import { Cart as cartPrisma } from "@prisma/client";
import { Product as productPrisma } from "@prisma/client";
import { Customer as customerPrisma } from "@prisma/client";
import { Cart } from "./cart";
import { Product } from "./product";
export class CartContainsProduct {
    private cartId!: string;
    private productName!: string;
    private quantity!: number;
    private cart?:Cart
    private product?:Product

    constructor(cartContainsProduct: { cartId: string, productName: string, quantity: number, cart?:Cart, product?:Product }) {
        this.setCartId(cartContainsProduct.cartId);
        this.setProductName(cartContainsProduct.productName);
        this.setQuantity(cartContainsProduct.quantity);
        this.setCart(cartContainsProduct.cart)
        this.setProduct(cartContainsProduct.product)
    }

    getCartId(): string {
        return this.cartId
    }
    setCartId(cartId: string): void {
        this.cartId = cartId;
    };

    getProductName(): string {
        return this.productName
    }
    setProductName(productName: string) {
        if (!productName) throw new Error('Product name is required.');
        this.productName = productName;
    };

    getQuantity(): number {
        return this.quantity;
    }
    setQuantity(quantity: number): void {
        if (quantity < 0) throw new Error('Quantity must be non-negative.');
        this.quantity = quantity
    }

    getCart(): Cart|undefined {
        return this.cart
    }

    setCart( cart:Cart|undefined) :void {
        this.cart = cart
    }

    getProduct(): Product|undefined {
        return this.product
    }

    setProduct( product:Product|undefined ): void {

        this.product = product
    }

    static from({

        cartId,
        productName,
        quantity,
        cart,
        product
    } : cartContainsProductPrisma & { cart?: cartPrisma; product?: productPrisma}
) {

    return new CartContainsProduct({
        cartId,
        productName,
        quantity,
        cart: cart? Cart.from({...cart}): undefined,
        product: product? Product.from(product): undefined
    })
}
}