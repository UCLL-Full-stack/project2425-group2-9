import CustomerDetails from "@/components/customer/customerDetails"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"




const Profile:React.FC = ()=> {

    

    return (

        <>
         <Header />
        <main>
       
        <CustomerDetails  />
        </main>

        <Footer  />
        </>
    )
}

export const getServerSideProps = async (context: { locale: any; }) => {
    const { locale } = context;
  
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
    };
  };

export default Profile