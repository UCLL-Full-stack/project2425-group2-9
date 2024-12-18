import Head from 'next/head';
import Image from 'next/image';
import styles from '@styles/home.module.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useEffect, useState } from 'react';
import PredefinedCustomers from '@/components/customer/prdefinedcustomers';

const Home: React.FC = () => {
  const [role, setRole] = useState('GUEST');
  const [welcomeMessage, setWelcomeMessage] = useState<string>("")
  useEffect(() => {
    let loggedInCustomer = sessionStorage.getItem('loggedInCustomer');
    if (loggedInCustomer) {
      const customer = JSON.parse(loggedInCustomer);
      setRole(customer.role);
      if (customer.role === "CUSTOMER"){
        setWelcomeMessage(`Welcome back, ${customer.role}!`);
      } else if (customer.role === "ADMIN") {
        setWelcomeMessage(`Welcome ${customer.role}! You can access all parts of the application.`);
      }else {
        const text = 'The table you see is for Evaluation Purpose!'
        setWelcomeMessage(`Welcome, guest! You are limited to just seeing the products in our shop. 
          If you wish to shop with us, please go ahead and signup or login.
           ${text}`);
      }
    } else {
      sessionStorage.setItem('loggedInCustomer', JSON.stringify({ role: 'GUEST' }));
      loggedInCustomer = 'GUEST';
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


        {welcomeMessage  && <p className={styles.guest}>{welcomeMessage}</p>}

        <section>

          <PredefinedCustomers />

        </section>
        
      </main>

      <Footer />
    </>
  );
};

export default Home;
