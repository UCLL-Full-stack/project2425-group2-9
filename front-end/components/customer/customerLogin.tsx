import CustomerService from "@/services/CustomerSevice";
import { StatusMessage, Role } from "@/types";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'next-i18next';

const UserLoginForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { t } = useTranslation('common');

    const clearErrors = () => {
        setStatusMessages([]);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();

        try {
            const response = await CustomerService.login({ username, password });

            if (response.ok) {
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
                setStatusMessages([{ type: "success", message: t('loginSuccess') }]);
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                const { message } = await response.json();
                setStatusMessages([{ type: "error", message }]);
            }
        } catch (error) {
            setStatusMessages([{ type: "error", message: (error as Error).message }]);
        }
    };

    return (
        <>
            <h3 className="px-0">{t('loginPage')}</h3>
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
                <label htmlFor="UsernameInput" className="block mb-2 text-sm font-medium">
                    {t('username')}:
                </label>
                <div className="block mb-2 text-sm font-medium">
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
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
                </div>
                <section className="block mb-2 text-sm font-medium">
                <button
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="submit"
        >
          {t('login')}
        </button>
        </section>
            </form>
        </>
    );
};

export default UserLoginForm;