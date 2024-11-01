import React from 'react';
import type { CartItem, Product } from '../types';

type CartProps = {
    cartItems: Array<CartItem>;
    products: Array<Product>;
    incrementQuantity: (productName: string) => void;
    decrementQuantity: (productName: string) => void;
    clearCart: () => void;
};

const Cart: React.FC<CartProps> = ({ cartItems, products, incrementQuantity, decrementQuantity, clearCart }:CartProps) => {
    const getProduct = (name:string) => products.find(product => product.name === name);

    return (
        <div>
            <h2>Cart</h2>
            {cartItems.map((item, index) => {
                // Assume that item refers to product in the cart, meanwhile product refers to product in the product database.
                const product = getProduct(item.productName);
                return product ? (
                    <div key={index}>
                        <p>{product.name}</p>
                        <p>{product.price} $ / {product.unit}</p>
                        <p>Quantity: {item.quantity}</p>
                        <button onClick={() => incrementQuantity(item.productName)}>+</button>
                        <button onClick={() => decrementQuantity(item.productName)}>-</button>
                    </div>
                ) : null;
            })}
            <button onClick={clearCart}>Clear Cart</button>
        </div>
    );
};

export default Cart;