import CustomerService from "@/services/CustomerSevice"
import { CustomerInput } from "@/types"
import { useEffect, useState } from "react"
import useSWR from "swr";
const PredefinedCustomers : React.FC = () => {

    // const [customers, setCustomers] = useState<CustomerInput[]| []>([])
    //  const [error, setError] = useState<string | null>(null);

    // const fetchCustomers = async () => {

    //     try {
    //         const customerResponse = await CustomerService.fetchUnprotectedCustomers();
    //         setCustomers(swrCustomers ||  customerResponse);
    //     } catch (error) {
    //         setError((error as any).message);
    //     } 
    //     }

    //     const { data: swrCustomers, error: swrError } = useSWR("customerList", fetchCustomers)

    //      useEffect(() => { 
    //           if (swrError) 
    //             { setError(swrError.message);
        
    //              } }, [swrError]);
        
        
    //         if (error) {
    //             return <div className="text-red-800">{error}</div>;
    //         }

            return (
                <>
                    
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100 border-b">
                                    <th className="py-2 px-4 text-left">Username</th>
                                        <th className="py-2 px-4 text-left">Password</th>
                                        <th className="py-2 px-4 text-left">Role</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                        <tr 
                                        
                                        className='border-b '
                                        >
                                            
                                            <td className="py-2 px-4">@roland</td>
                                            <td className="py-2 px-4">roland1234</td>
                                            <td className="py-2 px-4">ADMIN</td>
                                        </tr>

                                        <tr 
                                        
                                        className='border-b '
                                        >
                                            
                                            <td className="py-2 px-4">@matej</td>
                                            <td className="py-2 px-4">@matej1234</td>
                                            <td className="py-2 px-4">ADMIN</td>
                                        </tr>

                                        <tr 
                                        
                                        className='border-b '
                                        >
                                            
                                            <td className="py-2 px-4">@Rhone</td>
                                            <td className="py-2 px-4">Rhone_1245+</td>
                                            <td className="py-2 px-4">CUSTOMER</td>
                                        </tr>

                                        <tr 
                                        
                                        className='border-b '
                                        >
                                            
                                            <td className="py-2 px-4">ozil</td>
                                            <td className="py-2 px-4">ozil</td>
                                            <td className="py-2 px-4">CUSTOMER</td>
                                        </tr>




                                   
                                </tbody>
                            </table>
                        </div>
                    
                </>
            );
        
    }
export default PredefinedCustomers