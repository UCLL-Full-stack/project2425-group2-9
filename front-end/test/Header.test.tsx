
/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '.././components/header';
import { CartProvider } from '.././components/cartComponentProps';

describe('Header Component', () => {
    test('renders the header with the correct total items', () => {
        render(
            <CartProvider>
                <Header />
            </CartProvider>
        );

        expect(screen.getByText(/Cart \(0\)/)).toBeInTheDocument();
    });

    test('renders the header with the correct links', () => {
        render(
            <CartProvider>
                <Header />
            </CartProvider>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Products')).toBeInTheDocument();
    });
});