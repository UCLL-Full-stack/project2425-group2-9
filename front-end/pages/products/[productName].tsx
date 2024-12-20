import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import ProductService from '@/services/ProductService';
import type { Product } from '@/types';
import ProductInfo from "@/components/products/productInformation";
import Header from '@/components/header';
import Footer from '@/components/footer';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

type Props = {
    product: Product | null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { locale, params } = context;
    const { productName } = params!;
    const product = await ProductService.getAllProducts()
        .then(response => response.json())
        .then(products => products.find((p: Product) => p.name === productName));

    return {
        props: {
            product: product || null,
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

const ProductPage: React.FC<Props> = ({ product }) => {
    const { t } = useTranslation('common');
    const router = useRouter();

    if (router.isFallback) {
        return <div>{t('loading')}</div>;
    }

    if (!product) {
        return <div>{t('productNotFound')}</div>;
    }

    return (
        <>
            <Header />
            <main>
                <ProductInfo  />
            </main>
            <Footer />
        </>
    );
};

export default ProductPage;