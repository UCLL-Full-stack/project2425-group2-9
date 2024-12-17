import ProductService from "@/services/ProductService";
import { Product } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProductInfo: React.FC = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [productError, setProductError] = useState<string>("");

    const { productName } = useRouter().query;


    const fetchProduct = async () => {
        setProductError("");
        const response = await ProductService.getProductByName( productName as string);
        if (!response.ok) {
            if (response.status === 401) {
                setProductError(
                    "Sorry, you are not authorized to view this page. Please login first."
                );
            } else {
                setProductError(response.statusText);
            }
        } else {
            const product = await response.json();
            setProduct(product);
        }
    };

    useEffect(() => {
        if (productName) {
            fetchProduct();
        }
    }, [productName]);

    return (
        <>
            {productError && <div className="text-red-800">{productError}</div>}
            {product && (
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Description</th>
                            <th scope="col">Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.stock}</td>
                            <td>{product.description}</td>
                            <td>{product.unit}</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </>
    );
};

export default ProductInfo;
