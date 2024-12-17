import Head from 'next/head';
import Image from 'next/image';
import styles from '@styles/home.module.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [role, setRole] = useState('guest');
  useEffect(() => {
    const loggedInCustomer = sessionStorage.getItem('loggedInCustomer');
    if (loggedInCustomer) {
      const customer = JSON.parse(loggedInCustomer);
      setRole(customer.role);
    }
  }, []);
  return (
    <>
      <Head>
        <title>Courses</title>
        <meta name="description" content="Courses app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>

        <span>
        <h1 className={styles.welcome}>Welcome!</h1>
        <p className={styles.guest}>You are currently loggedIn as {role}. To gain more application access, please login.</p>
          <Image
            src="/images/shoppingcart.jpg"
            alt="Courses Logo"
            className={styles.padding}
            width={300}
            height={200}
          />
          
        </span>

        <div className={styles.description}>
          <p>
          This Online Shopping App is a platform designed to provide users with a 
          seamless shopping experience. <br />The application features a user-friendly 
          interface that allows users to browse products, add items to their cart, and manage their orders. <br />
          The app includes functionalities such as viewing product details, managing a shopping cart, and accessing user profiles.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Home;
