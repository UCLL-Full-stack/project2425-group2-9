import React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../components/cartComponentProps';
import styles from '../styles/header.module.css';
import { useTranslation } from 'next-i18next';
import Language from './language/langage';

const Header: React.FC = () => {
    const router = useRouter();
    const { totalItems } = useCart();
    const [loggedInUser, setLoggedInUser] = useState<{ username: string; role: string } | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const user = sessionStorage.getItem("loggedInCustomer");
        setLoggedInUser(user ? JSON.parse(user) : null);
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
                    <Link href="/">{t('home')}</Link>
                    {loggedInUser && (loggedInUser.role === "ADMIN" || loggedInUser.role === "CUSTOMER") &&
                        <Link href="/cart" className={styles.anchor}>
                            {t('cart')} ({totalItems})
                        </Link>
                    }
                    <Link href="/products" className={styles.anchor}>{t('products')}</Link>
                    {loggedInUser && (loggedInUser.role === "ADMIN" || loggedInUser.role === "CUSTOMER") &&
                        <Link href="/profile" className={styles.anchor}>{t('profile')}</Link>
                    }
                    {loggedInUser && loggedInUser.role === 'GUEST' && (
                        <Link
                            href="/customer"
                            className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
                        >
                            {t('login')}
                        </Link>
                    )}
                    {loggedInUser && loggedInUser.role !== 'GUEST' && (
                        <a
                            href="/customer"
                            onClick={handleClick}
                        >
                            {t('logout')}
                        </a>
                    )}
                    {loggedInUser && (loggedInUser.role === 'CUSTOMER' || loggedInUser.role === 'ADMIN') && (
                        <div className="text-white ms-5 mt-2 md:mt-0 pt-1 md:pt-0 group">
                            {t('welcome', { username: loggedInUser.username })}
                        </div>
                    )}

                    <Language />
                </nav>
            </header>
        </>
    );
};

export default Header;