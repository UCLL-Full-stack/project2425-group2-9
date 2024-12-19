import Image from 'next/image';
import { useState } from 'react';
import type { CartItem, Product } from '../../types';
import styles from '@styles/products.module.css';
import { useRouter } from 'next/router';
import ProductService from '@/services/ProductService';
import CartService from '@/services/cart';

type Props = {
    products: Array<Product>;
};

const Product: React.FC<Props> = ({ products }: Props) => {
    const [cartItems, setCartItems] = useState<Array<CartItem>>([]);
    const router = useRouter();

    const dynamicRoute = (productName: string) => {
        router.push(`/products/${productName}`);
    };

    const addToCart = (product: Product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.productName === product.name);
            if (existingItem) {
                return prevItems.map(item =>
                    item.productName === product.name ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
                );
            } else {
                return [...prevItems, { cartId: '1', productName: product.name, quantity: 1 }];
            }
        });
    };

    // Function that is called on click of 'Add to cart' button.
    const addToCartBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const productName = e.currentTarget.getAttribute('data-product-name');
        if (!productName) {
            alert('Product name not found');
            return;
        }

        try {
            const response = await ProductService.getProductByName(productName);
            if (!response.ok) {
                throw new Error(`Error fetching product: ${response.statusText}`);
            }
            const product: Product = await response.json();

            // Call the backend service to add the product to the cart
            const customerId = sessionStorage.getItem('loggedInCustomer') ? JSON.parse(sessionStorage.getItem('loggedInCustomer')!).id : null;
            if (!customerId) {
                alert('Please log in to add products to your cart');
                return;
            }

            const cartResponse = await CartService.addProductToCart({ customerId, productName });
            if (cartResponse.ok) {
                alert('Product added to cart successfully');
                addToCart(product);
            } else {
                alert('Failed to add product to cart');
            }
        } catch (error) {
            console.error("Failed to fetch product:", error);
            alert('Failed to add product to cart');
        }
    };

    const incrementQuantity = (productName: string) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productName === productName ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
            )
        );
    };

    const decrementQuantity = (productName: string) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productName === productName ? { ...item, quantity: Math.max((item.quantity ?? 1) - 1, 0) } : item
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
                        width={150}
                        height={150}
                        alt={product.name}
                        className={styles.hoverCursor}
                        onClick={() => dynamicRoute(product.name)}
                    />
                    <div>
                        <p>{product.name}</p>
                        <p>{product.price} $ / {product.unit}</p>
                        <button data-product-name={product.name} onClick={addToCartBtn}>Add to cart</button>
                        <p hidden>Stock: {product.stock}</p>
                        <p hidden>Quantity: <span>0</span></p>
                    </div>
                </article>
            ))}
        </>
    );
};

export default Product;