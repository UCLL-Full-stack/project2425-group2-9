
import Link from "next/link";
import styles from "../styles/header.module.css";
import { useEffect, useState } from "react";
import { CustomerInput } from "@/types";



const Header: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<CustomerInput | null>(null);
  useEffect(() => {
    const user = sessionStorage.getItem("loggedInCustomer");
    return setLoggedInUser(user ? JSON.parse(user) : null);
  }, []);

  const handleClick = () => {
    sessionStorage.removeItem("loggedInCustomer");
    setLoggedInUser(null);
  };

  return (
    <>

    <header className={styles.header}>
      <p className={styles.veso}>VESO</p>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/cart" className={styles.anchor}>Cart</Link>
        <Link href="/profile" className={styles.anchor}>Profile</Link>
        <Link href="/products" className={styles.anchor}>Products</Link>
        {!loggedInUser && (
          <Link
            href="/customer"
            className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
          >
            Login
          </Link>
        )}
        {loggedInUser && (
          <a
            href="/customer"
            onClick={handleClick}
            className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
          >
            Logout
          </a>
        )}
        {loggedInUser && (
          <div className="text-white ms-5 mt-2 md:mt-0 pt-1 md:pt-0 grow">
            Welcome, {loggedInUser?.username}!
          </div>
        )}
      </nav>
    </header>

    </>
    
  );
};

export default Header;