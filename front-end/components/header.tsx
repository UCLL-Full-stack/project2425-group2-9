
import Link from "next/link";
import styles from "../styles/header.module.css";
import { useEffect, useState } from "react";
import { CustomerInput } from "@/types";
import { useRouter } from "next/router";



const Header: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<CustomerInput | null>(null);

  const router = useRouter()
  useEffect(() => {
    
    const user = sessionStorage.getItem("loggedInCustomer");
      return setLoggedInUser(user ? JSON.parse(user) : null);
    
  }, []);

  const handleClick = () => {
    sessionStorage.removeItem('loggedInCustomer');
    setLoggedInUser({ username: '', role: 'GUEST' });
    router.push('/customer');
  };


  return (
    <>

    <header className={styles.header}>
      <p className={styles.veso}>VESO</p>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        {loggedInUser && (loggedInUser.role === "ADMIN" || loggedInUser.role === "CUSTOMER") &&
        <Link href="/cart" className={styles.anchor}>Cart</Link>
        }
        
        {loggedInUser && (loggedInUser.role === "ADMIN" || loggedInUser.role === "CUSTOMER") && 
          <Link href="/profile" className={styles.anchor}>Profile</Link>
        }
        
        <Link href="/products" className={styles.anchor}>Products</Link>
        {loggedInUser && loggedInUser.role === 'GUEST' && (
          <Link
            href="/customer"
            className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
          >
            Login
          </Link>
        )}
        {loggedInUser && loggedInUser.role !== 'GUEST' && (
          <a
            href="/customer"
            onClick={handleClick}
            className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
          >
            Logout
          </a>
        )}
         {loggedInUser &&  (loggedInUser.role === 'CUSTOMER' || loggedInUser.role === 'ADMIN') && (
        <div className="text-white ms-5 mt-2 md:mt-0 pt-1 md:pt-0 group">
          Welcome, {loggedInUser?.username}
        </div>
      )}
      </nav>
    </header>

    </>
    
  );
};

export default Header;