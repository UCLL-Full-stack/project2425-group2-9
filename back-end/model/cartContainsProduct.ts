import { CartContainsProduct as cartContainsProductPrisma } from "@prisma/client";
import { Cart as cartPrisma } from "@prisma/client";
import { Product as productPrisma } from "@prisma/client";
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

    setCart( cart?:Cart ) :void {

        //  if (cart?.getId() !== this.getCartId())
        //     throw new Error("cart does not match cartId")
        this.cart = cart

    }

    getProduct(): Product|undefined {
        return this.product
    }
//Q& why do i have to include product and cart when creating a new cartcontains product object. it only behaves this w&y if i use the validation in setters of cart and product.
    setProduct( product?:Product ): void {

        //  if (product?.getName().toLocaleLowerCase() !== this.getProductName().toLocaleLowerCase())
        //     throw new Error("product does not match the product name")
        this.product = product
    }

    static from({

        cartId,
        productName,
        quantity,
        cart,
        product
    } : cartContainsProductPrisma & { cart?: cartPrisma | null; product?: productPrisma }) {

    return new CartContainsProduct({
        cartId,
        productName,
        quantity,
        cart: cart? Cart.from({...cart}): undefined,
        product: product? Product.from(product): undefined
    })
}
}