import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { CartProvider } from '../components/cartComponentProps';
import { appWithTranslation } from 'next-i18next';
import nextI18nextConfig from '../next-i18next.config';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default appWithTranslation(MyApp, nextI18nextConfig);