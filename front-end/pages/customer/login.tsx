import Head from "next/head";
import Header from '@/components/header';
import UserLoginForm from "@/components/customer/customerLogin";
import Footer from "@/components/footer"
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PredefinedCustomers from '@/components/customer/prdefinedcustomers';
import { useEffect, useState } from 'react';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common'])),
    },
});

const Login: React.FC = () => {
    const { t } = useTranslation('common');

    const [role, setRole] = useState('GUEST');

    useEffect(()=> {
        const loggedInCustomer = sessionStorage.getItem('loggedInCustomer');
        setRole(loggedInCustomer ? JSON.parse(loggedInCustomer) : 'GUEST');
    }, [])
    return (
        <>
            <Head>
                <title>{t('login')}</title>
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    
                    <UserLoginForm />
                    <div>
                {(role === 'ADMIN' || role === 'GUEST') && 
                    <div>
                        <h3  className="mb-4">{t('evaluationPurpose')}</h3>
                        <PredefinedCustomers />
                    </div>
                    }
                </div>
                </section>
                
            </main>
            <Footer />
        </>
    );
};

export default Login;
