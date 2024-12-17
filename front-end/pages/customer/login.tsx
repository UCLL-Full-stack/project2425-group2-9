import Head from "next/head";
import Header from '@/components/header';
import UserLoginForm from "@/components/customer/customerLogin";
import Footer from "@/components/footer";

const Login: React.FC = () => {
    return (
        <>
            <Head>
                <title>User Signup</title>
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
