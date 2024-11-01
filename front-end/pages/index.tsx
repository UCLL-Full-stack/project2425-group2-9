import Header from "@/components/header";
import Head from "next/head";
import styles from "../styles/home.module.css";
import Product from "@/components/product";
import { Lecturer } from "@/types";
import { useState, useEffect } from "react";
import ProductService from "@/services/ProductService";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Array<Product>>([]);

  const fetchProducts = async () => {
    const response = await ProductService.getAllProducts();
    const productss = await response.json();
    setProducts(productss);
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  return (
    <>
      <Head>
        <title>VESO</title>
        <meta name="description" content="Courses app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/logo.ico" /> */}
      </Head>
      <Header />
      <main className={styles.main}>
        <section className={styles.products}>
          {
            products &&
            (<Product products={products} />)
          }
        </section>
      </main>
    </>
  );
};

export default Home;
