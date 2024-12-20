import React from 'react';
import Head from 'next/head';
import styles from '@styles/home.module.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common'])),
    },
});


const Home: React.FC = () => {
  const { t } = useTranslation('common');
  const [role, setRole] = useState('GUEST');
  const [welcomeMessage, setWelcomeMessage] = useState<string>("")

  useEffect(() => {
    const loggedInCustomer = sessionStorage.getItem('loggedInCustomer');
    if (loggedInCustomer) {
        const customer = JSON.parse(loggedInCustomer);
        setRole(customer.role);
        if (customer.role === "CUSTOMER") {
            setWelcomeMessage(t('welcome', { username: customer.username }));
        } else if (customer.role === "ADMIN") {
            setWelcomeMessage(t('welcome', { username: customer.username }) + " " + t('adminAccess'));
        } else {
            setWelcomeMessage(t('guestWelcome'));
        }
    } else {
        sessionStorage.setItem('loggedInCustomer', JSON.stringify({ role: 'GUEST' }));
        setWelcomeMessage(t('guestWelcome'));
    }
}, [t]);

  return (
    <>
      <Head>
        <title>Courses</title>
        <meta name="description" content="Courses app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
      <span className="flex flex-row justify-center items-center">
      <Image
        src="/images/shoppingcart.jpg"
        alt="Courses Logo"
        className={styles.vercelLogo}
        width={200}
        height={150}
      />
      <h1 className="pl-6 text-4xl text-gray-800"> { welcomeMessage  && <p className="pl-6 text-2xl text-cyan-700	">{welcomeMessage}</p>}</h1>
                </span>

        

      </main>
      <Footer />
    </>
  );
};

export default Home;
