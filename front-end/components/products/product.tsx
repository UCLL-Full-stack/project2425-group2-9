import Image from 'next/image'
import { useState } from 'react';
import type { Product } from '../../types';
import ProductService from '@/services/ProductService';
import CartItem from '../cartItem';
// import CartService from '@/services/CartService';
import CustomerService from '@/services/CustomerSevice';
import { useRouter } from 'next/router';


type Props = {
    products: Array<Product>;
    productName? : string
};

const Product: React.FC<Props> = ({ products, productName }: Props) => {
    const [product, setProducts] = useState<Array<Product>>([]);
     const router = useRouter();
    
    const dynamicRoute = (productName: string) => {
        router.push(`/products/${productName}`);
    };

    // Functions that is called on click of 'Add to cart' button.
    const addToCartBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const productInfo = e.currentTarget.parentElement?.children;

        if (!productInfo) {
            throw new Error("Product info null.");
        }
    
        // Unhide hidden product info.
        for (let info of productInfo) {
            if (info.getAttribute("hidden") === "") {
                info.removeAttribute("hidden");
            }
        }
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
                        onClick={() => dynamicRoute(product.name)}
                        />
                    <div>
                        <p>{product.name}</p>
                        <p>{product.price} $ / {product.unit}</p>
                        <button onClick={(e) => addToCartBtn(e)}>Add to cart</button>
                        <p hidden >Stock: {product.stock}</p>
                        {/* Quantity Increases without accessing actual value in the database. */}
                        <p hidden>Quantity: <span>0</span></p>
                    </div>
                </article>
            ))}
            
        </>
    );
};

export default Product;