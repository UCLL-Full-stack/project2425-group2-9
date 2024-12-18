import ProductService from "@/services/ProductService";
import { Product } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProductInfo: React.FC = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [productError, setProductError] = useState<string>("");
    const router = useRouter();
    const { productName } = useRouter().query;

    const fetchProduct = async () => {
        try {
            setProductError("");
            const response = await ProductService.getProductByName(productName as string);
            if (!response.ok) {
                if (response.status === 400) {
                    setProductError("Sorry, you are not authorized to view this page. Please login first.");
                    setTimeout(() => {
                        router.push("/customer");
                    }, 3000); 
                } else {
                    setProductError(response.statusText);
                }
                
            } else {
                const product = await response.json();
                setProduct(product);
            }
        } catch (error) {
            setProductError("error:" + (error as Error).message);
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
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-2 px-4 text-left">Image</th>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Price</th>
                                <th className="py-2 px-4 text-left">Stock</th>
                                <th className="py-2 px-4 text-left">Description</th>
                                {/* <th className="py-2 px-4 text-left">Unit</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="py-2 px-4">
                                    <img src={product.imagePath} alt={product.name} className="w-16 h-16 object-cover" />
                                </td>
                                <td className="py-2 px-4">{product.name}</td>
                                <td className="py-2 px-4">${product.price} / {product.unit}</td>
                                <td className="py-2 px-4">{product.stock}</td>
                                <td className="py-2 px-4">{product.description}</td>
                                {/* <td className="py-2 px-4">{product.unit}</td> */}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default ProductInfo;
