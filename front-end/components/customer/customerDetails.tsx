import React, { useEffect, useState } from 'react';
import CustomerService from "@/services/CustomerSevice";
import { CustomerInput } from "@/types";
import { useRouter } from "next/router";
import useSWR from "swr";

import styles from '@styles/products.module.css';

const CustomerDetails: React.FC = () => {
    const [customers, setCustomers] = useState<CustomerInput[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchCustomers = async () => {
        try {
            const loggedInCustomer = sessionStorage.getItem("loggedInCustomer");
            if (loggedInCustomer && JSON.parse(loggedInCustomer).role === "GUEST") {
                setError("You are not authorized to view this page. Please login first. Redirecting you to the login/signup page...");
                 setTimeout(() => {
                     router.push('/customer/');
                 }, 5000);
                return;
            }

            const customerData = await CustomerService.fetchCustomers();
            setCustomers(swrCustomers || customerData);
        } catch (error) {
            setError((error as any).message);
        }
    };

    const { data: swrCustomers, error: swrError } = useSWR("customerList", fetchCustomers)
    useEffect(() => { 
      if (swrError) 
        { setError(swrError.message);

         } }, [swrError]);


    if (error) {
        return <div className="text-red-800">{error}</div>;
    }

    return (
        <>
            {customers && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-2 px-4 text-left">Role</th>
                                <th className="py-2 px-4 text-left">First Name</th>
                                <th className="py-2 px-4 text-left">Last Name</th>
                                <th className="py-2 px-4 text-left">Username</th>
                                <th className="py-2 px-4 text-left">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr 
                                key={customer.username} 
                                className={`border-b ${styles.hoverCursor}`}
                                >
                                    <td className="py-2 px-4">{customer.role}</td>
                                    <td className="py-2 px-4">{customer.firstName}</td>
                                    <td className="py-2 px-4">{customer.lastName}</td>
                                    <td className="py-2 px-4">{customer.username}</td>
                                    <td className="py-2 px-4">{customer.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default CustomerDetails;
