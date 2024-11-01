import Image from 'next/image'
import { useState } from 'react';
import type { Product,CartItem } from '../types';
import Cart from './cart';
import ProductService from '@/services/ProductService';


type Props = {
    products: Array<Product>;
};

const Product: React.FC<Props> = ({ products }: Props) => {
    const [cartItems, setCartItems] = useState<Array<CartItem>>([]);
    
    const addToCart = (product: Product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.productName === product.name);
            if (existingItem) {
                return prevItems.map(item =>
                    item.productName === product.name ? { ...item, quantity: (item.quantity??0) + 1 } : item
                );
            } else {
                return [...prevItems, { cartId: 1, productName: product.name, quantity: 1 }];
            }
        });
    };

    const addItemToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const productInfo = e.currentTarget.parentElement?.children;
    
        if (!productInfo) {
            throw new Error("Product info null.");
        }
    
        for (let info of productInfo) {
            if (info.getAttribute("hidden") === "") {
                info.removeAttribute("hidden");
            }
        }
    
        // Get the product name
        const productName = e.currentTarget.parentElement?.children[0].textContent ?? '';
        console.log("Fetching product:", productName);
    
        try {
            const response = await ProductService.getProductByName(productName);
            if (!response.ok) {
                throw new Error(`Error fetching product: ${response.statusText}`);
            }
            const product: Product = await response.json();
            addToCart(product);
        } catch (error) {
            console.error("Failed to fetch product:", error);
        }
    };

    const incrementQuantity = (productName: string) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productName === productName ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
            )
        );
    };
    const decrementQuantity = (name: string) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productName === name ? { ...item, quantity: Math.max(item.quantity? - 1: 1) } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };
        
    
    

    return (
        <>
            {products.map((product, index) => (
                <article key={index}>
                    <Image
                        src={product.imagePath}
                        width={150} // this is changed in product.module.css
                        height={150}
                        alt={product.name}
                        />
                    <div>
                        <p>{product.name}</p>
                        <p>{product.price} $ / {product.unit}</p>
                        <button onClick={(e) => addItemToCart(e)}>Add to cart</button>
                        <p hidden >Stock: {product.stock}</p>
                        <p hidden >Quantity: 0</p>
                    </div>
                </article>
            ))}
            <Cart 
            cartItems={cartItems}
            products={products}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
            clearCart={clearCart}
            />
        </>
    );
};

export default Product;