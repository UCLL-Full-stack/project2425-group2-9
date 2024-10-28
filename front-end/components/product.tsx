import Image from 'next/image'
import { useState } from 'react';
import type { Product } from '../types';


type Props = {
    products: Array<Product>;
};

const Product: React.FC<Props> = ({ products }: Props) => {
    const addToCart = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const productInfo = e.target.parentElement?.children;


        if (!productInfo) {throw new Error("Product info null.")};
        for (let info of productInfo) {
            if (info.getAttribute("hidden") === "") {
                info.removeAttribute("hidden");
            }
        };
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
                        <button onClick={(e) => addToCart(e)}>Add to cart</button>
                        <p hidden >Stock: {product.stock}</p>
                        <p hidden >Quantity: 0</p>
                    </div>
                </article>
            ))}
        </>
    );
};

export default Product;