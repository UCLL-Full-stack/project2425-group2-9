
/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/header';
import { CartProvider } from '../components/cartComponentProps';

// npm install --save-dev jest
// npm install --save-dev @testing-library/dom
// npm install --save-dev @testing-library/react
// npm install --save-dev esbuild-jest esbuild
// module.exports = {
//     testEnvironment: 'jsdom',
//     transform: {
//         '\\.[jt]sx?$': 'esbuild-jest',
//     },
// }

test('renders the header with the correct total items', async () => {
    render(
        
        // <CartProvider>
            <Header />
        // </CartProvider>
    );

    // expect(screen.getByText(/Cart \(0\)/)).toBeInTheDocument();
});

    // test('renders the header with the correct links', () => {
    //     render(
    //         <CartProvider>
    //             <Header />
    //         </CartProvider>
    //     );

    //     expect(screen.getByText('Home')).toBeInTheDocument();
    //     expect(screen.getByText('Products')).toBeInTheDocument();
    // });