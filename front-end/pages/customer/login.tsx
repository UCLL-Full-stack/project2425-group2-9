import Head from "next/head";
import Header from '@/components/header';
import UserLoginForm from "@/components/customer/customerLogin";
import Footer from "@/components/footer"
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common'])),
    },
});

const Login: React.FC = () => {
    const { t } = useTranslation('common');
    return (
        <>
            <Head>
                <title>{t('login')}</title>
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    <UserLoginForm />
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Login;
