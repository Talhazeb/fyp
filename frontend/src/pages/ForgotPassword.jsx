import { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
    
        const formData = new FormData(event.currentTarget);
        const payload = {
            email: formData.get("email"),
        };
    
        try {
            const response = await fetch("http://185.130.227.124/compod/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
            
            toast.success(data.result, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            
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
                            Forgot Password
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
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="mt-8">
                        <p className="text-center text-sm text-gray-600">
                            Remembered your password?{" "}
                            <a
                                href="/"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

