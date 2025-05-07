import CustomerService from "@/services/CustomerSevice";
import { StatusMessage, Role } from "@/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from 'next-i18next';
import DOMPurify from 'dompurify';
const UserSignUpForm: React.FC = () => {
  const { t } = useTranslation('common');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role | undefined>("CUSTOMER");
  const [nameError, setNameError] = useState("");
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const router = useRouter();

  const clearErrors = () => {
    setNameError("");
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    const errorMessage = t('allFieldsRequired');
    if (!firstName.trim() || !lastName.trim() || !userName.trim() || !phone.trim() || !role) {
      setStatusMessages([{ type: "error", message: errorMessage }]);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    clearErrors();

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
        username: userName,
      });

      if (response.status === 200) {
        setStatusMessages([{ type: "success", message: t('signupSuccess') }]);
        const customer = await response.json();
        sessionStorage.setItem(
          'loggedInCustomer',
          JSON.stringify({
            message: customer.message,
            token: customer.token,
            fullName: customer.fullname,
            username: customer.username,
            role: customer.role,
            id: customer.id
          })
        );
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        const { errorMessage } = await response.json();
        setStatusMessages([{ type: "error", message: errorMessage }]);
      }
    } catch (error) {
      console.error(error);
      setStatusMessages([{ type: 'error', message: (error as Error).message }]);
    }
  };

  return (
    <>
      <h3 className="px-0">{t('signupPage')}</h3>
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
                {DOMPurify.sanitize(message)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="FirstNameInput" className="block mb-2 text-sm font-medium">
          {t('firstname')}:
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {nameError && <div>{nameError}</div>}
        </div>
        <label htmlFor="LastNameInput" className="block mb-2 text-sm font-medium">
          {t('lastname')}:
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {nameError && <div>{nameError}</div>}
        </div>
        <label htmlFor="UserNameInput" className="block mb-2 text-sm font-medium">
          {t('username')}:
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {nameError && <div>{nameError}</div>}
        </div>
        <label htmlFor="PasswordInput" className="block mb-2 text-sm font-medium">
          {t('password')}:
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
          {nameError && <div>{nameError}</div>}
        </div>
        <label htmlFor="PhoneInput" className="block mb-2 text-sm font-medium">
          {t('phone')}:
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {nameError && <div>{nameError}</div>}
        </div>
        <label htmlFor="RoleInput" className="block mb-2 text-sm font-medium">
          {t('role')}:
        </label>
        <div className="block mb-2 text-sm font-medium">
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="CUSTOMER">{t('customer')}</option>
            <option value="ADMIN">{t('admin')}</option>
          </select>
          {nameError && <div>{nameError}</div>}
        </div>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="submit"
        >
          {t('signUp')}
        </button>
      </form>
    </>
  );
};

export default UserSignUpForm;