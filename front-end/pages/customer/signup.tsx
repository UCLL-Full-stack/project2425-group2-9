import UserSignUpForm from "@/components/customer/customerSignupForm";
import Head from "next/head";
import Header from '@/components/header';
import Footer from "@/components/footer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const signup: React.FC = () => {
    return (
        <>
            <Head>
                <title>User Signup</title>
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    <UserSignUpForm />
                </section>
            </main>

            <Footer />
        </>
    );
};

export const getServerSideProps = async (context: { locale: any; }) => {
    const { locale } = context;
  
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
    };
  };

export default signup;
