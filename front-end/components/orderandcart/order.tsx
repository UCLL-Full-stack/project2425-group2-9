import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';


const ItemOrder: React.FC = () => {
    const router = useRouter();
    const [orderResponse, setOrderResponse] = useState<string | null>(null);

    useEffect(() => {
        if (router.query.orderResponse) {
            setOrderResponse(JSON.parse(router.query.orderResponse as string));
        }
    }, [router.query.orderResponse]);

    //  if (!orderResponse) {
    //     return <p className="text-l font-medium mb-4">Loading...</p>;
    //  }

    return (
        <>

       
            <main>
            <h2 className="text-xl font-bold mb-4">Order placed successfully. Thank you for shopping with us
                Hope you enjoyed your time.
            </h2>
            <p>{orderResponse}</p>
            </main>

            
        </>
    )
}

export default ItemOrder