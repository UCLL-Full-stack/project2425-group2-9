import CustomerService from "@/services/CustomerSevice";
import { StatusMessage, Role } from "@/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// const GUEST_ROLE: Role = "CUSTOMER"; // Define the GUEST role value
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";

const UserSignUpForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role | undefined>("CUSTOMER");
  const [ nameError, setNameError] = useState("");
  // const [statusMessage, setStatusMessage] = useState<StatusMessage | undefined>(undefined)

  const [statusMessages, setStatusMessages]= useState<StatusMessage[]>([])
  const router = useRouter();

  const clearErrors = () => {
    //reset errors and status messages
    setNameError("");
    setStatusMessages([]);
  };

  const validate = (): boolean => {

    let result  = false
    const errorMessage = "All fields are required.";

    if (!firstName.trim() || !lastName.trim() || !userName.trim() || !phone.trim() || !role) {
        setStatusMessages([{type : "error" , message : errorMessage}]);
        return result;
      }
    return true
     
  };
  const handleSubmit = async (event: any) => {

    event.preventDefault();
    clearErrors();

    
    //handle default browser behavior of refreshing the page after a form submitted
    
    if (!validate()) {
        return;
    }

    try {
        const response = await CustomerService.register({
          password,
          firstName,
          lastName,
          role,
          phone,
          username : userName,
        });
  
        if (response.status === 200) {
          setStatusMessages( [ { type : "success" , message : `Signup  successful: redirecting to home page...`}]);
          const customer= await response.json();
          sessionStorage.setItem(
            'loggedInCustomer',
            JSON.stringify({
                message : customer.message,
                token: customer.token,
                fullName: customer.fullname,
                username: customer.username,
                role: customer.role,
                id: customer.id
            })
          )
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else  {
          const { errorMessage } = await response.json();
          setStatusMessages( [ { type : "error" , message : errorMessage } ]);
        }
      } catch (error) {
        console.error(error)
        setStatusMessages([{ type: 'error', message: (error as Error).message}]);
      }
};


  return (
    <>
      <h3 className="px-0">Signup page</h3>
      {statusMessages && (
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
      <label htmlFor="FirstNameInput" className="block mb-2 text-sm font-medium">
          First Name:
        </label>
        <div className="block mb-2 text-sm font-medium">
        <input
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          // placeholder="First Name"
          className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
        {nameError && (
             <div>{ nameError} 
             </div> 
        )}
        </div>
        <label htmlFor="LastNameInput" className="block mb-2 text-sm font-medium">
          Last Name:
        </label>
        <div className="block mb-2 text-sm font-medium">
        <input
          type="text"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          // placeholder="Last Name"
          className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
         {nameError && (
             <div>{ nameError} 
             </div> 
        )}
        </div>
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
        <div className="relative">
        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
        {nameError && (
             <div>{ nameError} 
             </div> 
        )}
        </div>
        <label htmlFor="PhoneInput" className="block mb-2 text-sm font-medium">
          Phone:
        </label>
        <div className="block mb-2 text-sm font-medium">
        <input
          type="text"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          // placeholder="Phone"
          className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
        {nameError && (
             <div>{ nameError} 
             </div> 
        )}
        </div>

        <label htmlFor="RoleInput" className="block mb-2 text-sm font-medium">
    Role:
</label>
<div className="block mb-2 text-sm font-medium">
    <select
        value={role}
        onChange={(event) => setRole(event.target.value as Role)}
        className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    >
        <option value="CUSTOMER">Customer</option>
        <option value="ADMIN">Admin</option>
    </select>
    {nameError && (
        <div>{nameError}</div>
    )}
</div>


        <button
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </>
  );
};

export default UserSignUpForm;
