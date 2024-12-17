import CustomerService from "@/services/CustomerSevice";
import { StatusMessage, Role } from "@/types";

// const GUEST_ROLE: Role = "CUSTOMER"; // Define the GUEST role value
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";

const UserLoginForm: React.FC = () => {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [ nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  // const [statusMessage, setStatusMessage] = useState<StatusMessage | undefined>(undefined)

  const [statusMessages, setStatusMessages]= useState<StatusMessage[]>([])
  const router = useRouter();

  const clearErrors = () => {
    //reset errors and status messages
    setNameError("");
    setPasswordError(null)
    setStatusMessages([]);
  };

  const validate = (): boolean => {

    let result  = true

    if (!userName || userName.trim() === "") {
        setNameError("Name is required");
        result = false;
      }
  
      if (!password || password.trim() === "") {
        setPasswordError("Password is required");
        result = false;
      }
    return result
     
  };
  const handleSubmit = async (event: any) => {

    event.preventDefault();
    clearErrors();

    
    //handle default browser behavior of refreshing the page after a form submitted
    
    if (!validate()) {
        return;
    }

    try {
        const response = await CustomerService.login({
          password,
          username : userName,
        });
  
        if (response.status === 200) {
        //   sessionStorage.setItem('username', userName);
          setStatusMessages( [ { type : "success" , message : `Login  successful: redirecting to product page...`}]);
          const customer= await response.json();
          sessionStorage.setItem(
            'loggedInCustomer',
            JSON.stringify({
                // message : customer.message,
                token: customer.token,
                fullName: customer.fullname,
                username: customer.username,
                role: customer.role,
            })
          )
          setTimeout(() => {
            router.push('/products');
          }, 2000);
        } else  {
            const { errorMessage } = await response.json();
          setStatusMessages( [ { type : "error" , message : errorMessage } ]);
        }
      } catch (error) {
        console.error(error)
        setStatusMessages([{ type: 'error', message: 'An error occurred during registration' }]);
      }
};


  return (
    <>
      <h3 className="px-0">Login page</h3>
      {statusMessages.length > 0 && (
        <div className="row">
          <ul className="list-none mb-3 mx-auto ">
            {statusMessages.map(({ message, type }, index) => (
              <li
                key={index}
                className={classNames({
                  "text-red-800": type === "error",
                  "text-green-800": type === "success",
                })}
              >
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
     
        <label htmlFor="UserNameInput" className="block mb-2 text-sm font-medium">
          User Name:
        </label>
        <div className="block mb-2 text-sm font-medium">
        <input
          type="text"
          value={userName}
          onChange={(event) => setUserName(event.target.value)}
          // placeholder="Username"
          className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
         {nameError && (
             <div>{ nameError} 
             </div> 
        )}
        </div>
        <label htmlFor="PasswordInput" className="block mb-2 text-sm font-medium">
          Password:
        </label>
        <div className="block mb-2 text-sm font-medium">
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          // placeholder="Password"
          className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
        {passwordError && (
             <div>{ passwordError} 
             </div> 
        )}
        </div>


        <button
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="submit"
        >
          login
        </button>
      </form>
    </>
  );
};

export default UserLoginForm
