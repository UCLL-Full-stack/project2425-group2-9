import Image from 'next/image';
import { useState } from 'react';
import type { CartItem, Product } from '../../types';
import styles from '@styles/products.module.css';
import { useRouter } from 'next/router';
import ProductService from '@/services/ProductService';
import CartService from '@/services/cart';
import React from 'react';
import { useTranslation } from 'next-i18next';

type Props = {
    products: Array<Product>;
};

const Product: React.FC<Props> = ({ products }: Props) => {
    const { t } = useTranslation('common');
    const [cartItems, setCartItems] = useState<Array<CartItem>>([]);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
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
            setStatusMessage(t('productNameNotFound'));
            return;
        }

        const loggedInCustomer = sessionStorage.getItem('loggedInCustomer');
        if (!loggedInCustomer) {
            setStatusMessage(t('pleaseSignInToAddProductsToTheCart'));
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
                alert(t('pleaseLogInToAddProductsToYourCart'));
                return;
            }

            const cartResponse = await CartService.addProductToCart({ customerId, productName });
            if (cartResponse.ok) {
                setStatusMessage(t('productAddedToCartSuccessfully'));
                addToCart(product);
            } else {
                alert(t('failedToAddProductToCart'));
            }
        } catch (error) {
            
            if (error instanceof Error) {
                setStatusMessage(`${error}`);
            } else {
                setStatusMessage(t('anUnknownErrorOccurred'));
            }
        }
    };


    return (
        <>
         <section>
         {statusMessage && <div className="mb-4 p-4 bg-blue-100 text-blue-700 border border-blue-400 rounded">{statusMessage}</div>}
         </section>
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
                        <button data-product-name={product.name} 
                        onClick={addToCartBtn}
                        className='px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
                        >
                            {t('addToCart')}
                        </button>
                        <p hidden>{t('stock')}: {product.stock}</p>
                        <p hidden>{t('quantity')}: <span>0</span></p>
                    </div>
                </article>
            ))}
        </>
    );
};

export default Product;