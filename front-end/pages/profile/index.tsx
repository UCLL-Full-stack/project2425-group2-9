import CustomerDetails from "@/components/customer/customerDetails"
import Footer from "@/components/footer"
import Header from "@/components/header"




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

export default Profile