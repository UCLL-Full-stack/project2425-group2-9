import React, { useState, useEffect } from 'react';
import Header from "@/components/header";
import ProductService from "@/services/CartService";
import type { Product } from "@/types";

const Cart: React.FC = () => {
    const [products, setProducts] = useState<Array<Product>>([]);
    const fetchProductsByCartId = async (cartId: number): Promise<void> => {
        try {
            const response = await ProductService.fetchAllCarts(cartId); // TODO name is misleading. Endpoint doesn't work.
            const result = await response.json();
            setProducts(result);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    useEffect(() => {
        fetchProductsByCartId(1);
    }, []);

    return (
        <>
            <Header />
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Unit</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.name}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.unit}</td>
                            <td>{product.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Cart;