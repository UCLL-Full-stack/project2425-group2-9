import React from 'react';
import Head from 'next/head';
import styles from '@styles/home.module.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useEffect, useState } from 'react';
import PredefinedCustomers from '@/components/customer/prdefinedcustomers';
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
    let loggedInCustomer = sessionStorage.getItem('loggedInCustomer');
    if (loggedInCustomer) {
      const customer = JSON.parse(loggedInCustomer);
      setRole(customer.role);
      if (customer.role === "CUSTOMER"){
        setWelcomeMessage(t('welcome', { username: customer.role }));
      } else if (customer.role === "ADMIN") {
        setWelcomeMessage(t('welcome', { username: customer.role }) + " " + t('adminAccess'));
      }else {
        const text = t('evaluationPurpose');
        setWelcomeMessage(t('guestWelcome') + " " + text);
      }
    } else {
      sessionStorage.setItem('loggedInCustomer', JSON.stringify({ role: 'GUEST' }));
      loggedInCustomer = 'GUEST';
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
