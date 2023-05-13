import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { updateEmail, updateFirstname, updateLastname } from "../redux/slice";
import { useDispatch } from "react-redux";

export default function Login() {
    const dispatch = useDispatch();
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const payload = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        try {
            const response = await fetch("http://185.130.227.124/compod/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.result === "success") {
                const { email, firstname, lastname } = data;

                setUser({ email, firstname, lastname });
                localStorage.setItem(
                    "user",
                    JSON.stringify({ email, firstname, lastname })
                );
                dispatch(updateEmail(email));
                dispatch(updateFirstname(firstname));
                dispatch(updateLastname(lastname));
                toast.success("Login successful!", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });
                navigate("/Dashboard", { replace: true });
            } else {
                toast.error("Invalid email or password!", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-r from-blue-200 to-blue-500">
            <div className="w-full max-w-md m-auto">
                <div className="bg-white rounded-lg border border-blue-300 shadow-lg py-10 px-16 backdrop-filter backdrop-blur-md">
                    <div className="max-w-md mx-auto">
                        <div className="text-4xl font-bold text-gray-800 text-center mb-8">
                            Sign In
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-600"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full px-3 py-2 placeholder-gray-400 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-600"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="w-full px-3 py-2 placeholder-gray-400 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        name="remember"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="ml-2 text-sm text-gray-900"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <div>
                                    <a
                                        href="/forgot"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Forgot your password?
                                    </a>    
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="relative w-full py-2 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {isLoading && (
                                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8z"
                                                ></path>
                                            </svg>
                                        </span>
                                    )}
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="mt-8">
                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <a
                                href="/Signup"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
