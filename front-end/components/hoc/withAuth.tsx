import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent: React.FC) => {
    const AuthComponent: React.FC = (props) => {
        const router = useRouter();

        useEffect(() => {
            const loggedInCustomer = sessionStorage.getItem("loggedInCustomer");
            if (!loggedInCustomer) {
                router.push('/customer/login');
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
