import React from 'react';
import Image from 'next/image';
import type { CartItem, Product } from '../../types';

type Props = {
    cartItems: Array<CartItem>;
    getProduct: (productName: string) => Product | undefined;
    incrementQuantity: (productName: string) => void;
    decrementQuantity: (productName: string) => void;
    products: Array<Product>;
    clearCart: () => void;
    deleteCartItem : (productName : string) => void
    placeAnOrder : () => void
};

const AddToCart: React.FC<Props> = ({cartItems = [], getProduct, incrementQuantity, decrementQuantity , deleteCartItem, placeAnOrder}: Props) => {
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
                                <td className="px-4 py-2 border-b">{product.name}</td>
                                <td className="px-4 py-2 border-b">{product.price} $</td>
                                <td className="px-4 py-2 border-b">{product.unit}</td>
                                <td className="px-4 py-2 border-b">{item.quantity}</td>
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

            <div>
                <button
                onClick={placeAnOrder}
                className="px-2 py-1 ml-2 bg-blue-300 text-white rounded hover:bg-gray-600"
                >
                    order items
                </button>
            </div>
        </div>
    );
};

export default AddToCart;
