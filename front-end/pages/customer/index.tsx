import Head from "next/head";
import Header from '@/components/header';
import styles from "styles/home.module.css";
import { useRouter } from "next/router";
import Footer from "@/components/footer";

const Redirect: React.FC = () => {
  
    const router = useRouter();
    const handleSignUpClick = () => { 
        
        router.push('/customer/signup');
     };

    
     const handleLoginClick = () => { 
        
        router.push('/customer/login'); 
    };
    return (
        <>
            <Head>
                <title>User Signup</title>
            </Head>
            <Header />
            <main>

                <div id="form" className="p-6 min-h-screen flex flex-col items-center">

              <div className={styles.login}>
              <button
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        //   type="submit"
          onClick={handleSignUpClick}
        >
          signup
        </button>
              </div>
        <div className={styles.login}>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        //   type="submit"
          onClick={handleLoginClick}
        >
          login
        </button>
        </div>
                </div>
    

                
            </main>
            
            <Footer />
        </>
    );
};

export default Redirect;
