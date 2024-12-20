import ProductService from "@/services/ProductService";
import { Product } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from 'react';
import { useTranslation } from 'next-i18next';

const ProductInfo: React.FC = () => {
    const { t } = useTranslation();
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
                    setProductError(t('notAuthorized'));
                    setTimeout(() => {
                        router.push("/customer");
                    }, 5000); 
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
                                <th className="py-2 px-4 text-left">{t('image')}</th>
                                <th className="py-2 px-4 text-left">{t('name')}</th>
                                <th className="py-2 px-4 text-left">{t('price')}</th>
                                <th className="py-2 px-4 text-left">{t('stock')}</th>
                                <th className="py-2 px-4 text-left">{t('description')}</th>
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
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default ProductInfo;