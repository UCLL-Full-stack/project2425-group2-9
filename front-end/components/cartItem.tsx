import React from 'react';
import Image from 'next/image';
import type { CartItem as CartItemType, Product } from '../types';

type CartProps = {
    cartItems: Array<CartItemType>;
    products: Array<Product>;
    incrementQuantity: (productName: string) => void;
    decrementQuantity: (productName: string) => void;
    clearCart: () => void;
};

const CartItem: React.FC<CartProps> = ({ cartItems, products, incrementQuantity, decrementQuantity, clearCart }: CartProps) => {
    const getProduct = (name: string) => products.find(product => product.name === name);

    return (
        <div>
            {cartItems.map((item, index) => {
                const product = getProduct(item.productName);
                return product ? (
                    <article key={index}>
                        <Image
                            src={product.imagePath}
                            width={150}
                            height={150}
                            alt={product.name}
                        />
                        <div>
                            <p>{product.name}</p>
                            <p>{product.price} $ / {product.unit}</p>
                            <p>Quantity: {item.quantity}</p>
                            <button onClick={() => incrementQuantity(item.productName)}>+</button>
                            <button onClick={() => decrementQuantity(item.productName)}>-</button>
                        </div>
                    </article>
                ) : null;
            })}
            <button onClick={clearCart}>Clear Cart</button>
        </div>
    );
};

export default CartItem;