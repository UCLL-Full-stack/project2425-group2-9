import React from 'react';
import Image from 'next/image';
import type { CartItem, Product } from '../../types';
import DOMPurify from 'dompurify';
type Props = {
    cartItems: Array<CartItem>;
    getProduct: (productName: string) => Product | undefined;
    incrementQuantity: (productName: string) => void;
    decrementQuantity: (productName: string) => void;
    products: Array<Product>;
    clearCart: () => void;
    deleteCartItem : (productName : string) => void
    totalPrice : number
};

const AddToCart: React.FC<Props> = ({totalPrice, cartItems = [], getProduct, incrementQuantity, decrementQuantity , deleteCartItem,}: Props) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">Image</th>
                        <th className="px-4 py-2 border-b">Product Name</th>
                        <th className="px-4 py-2 border-b">Price</th>
                        <th className="px-4 py-2 border-b">Unit</th>
                        <th className="px-4 py-2 border-b">Quantity</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(cartItems) && cartItems.map((item, index) => {
                        const product = getProduct(item.productName);
                        return product ? (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b">
                                    <Image
                                        src={product.imagePath}
                                        width={50}
                                        height={50}
                                        alt={product.name}
                                        className="rounded"
                                    />
                                </td>

                                <td className="px-4 py-2 border-b">{DOMPurify.sanitize(product.name)}</td>
                                <td className="px-4 py-2 border-b">{product.price} $</td>
                                <td className="px-4 py-2 border-b">{product.unit}</td>
                                <td className="px-4 py-2 border-b">{item.quantity}</td>
                                <td className="py-2 px-4">${(product.price * item.quantity).toFixed(2)}</td>
                                <td className="px-4 py-2 border-b">
                                    <button
                                        onClick={() => incrementQuantity(item.productName)}
                                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => decrementQuantity(item.productName)}
                                        className="px-2 py-1 ml-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        -
                                    </button>

                                    <button
                                        onClick={() => deleteCartItem(item.productName)}
                                        className="px-2 py-1 ml-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ) : null;
                    })}
                </tbody>
            </table>
            { <section className="mt-4">
                <h2 >Total Price: ${totalPrice.toFixed(2)}</h2>
            </section> }
            
        </div>
    );
};

export default AddToCart;
