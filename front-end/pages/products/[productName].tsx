import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import ProductService from '@/services/ProductService';
import type { Product } from '@/types';

type Props = {
    product: Product | null;
};

const ProductPage: React.FC<Props> = ({ product }) => {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>{product.price} $ / {product.unit}</p>
            <img src={product.imagePath} alt={product.name} />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { productName } = context.params!;
    const product = await ProductService.getAllProducts()
        .then(response => response.json())
        .then(products => products.find((p: Product) => p.name === productName));

    return {
        props: {
            product: product || null,
        },
    };
};

export default ProductPage;