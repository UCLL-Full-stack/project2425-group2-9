import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextProps {
    cartItems: any[];
    totalItems: number;
    setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
    updateTotalItems: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);



interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        updateTotalItems();
    }, [cartItems]);

    const updateTotalItems = () => {
        const uniqueItemsCount = cartItems.length;
        setTotalItems(uniqueItemsCount);
    };

    return (
        <CartContext.Provider value={{ cartItems, totalItems, setCartItems, updateTotalItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};