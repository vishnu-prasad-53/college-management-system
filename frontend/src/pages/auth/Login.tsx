import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../context/AuthContext";
import { useLogin } from "../../hooks/useLogin";

import { loginSchema, type LoginFormData } from "../../validators/auth.validator";

const Login = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const loginMutation = useLogin();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),

        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (!isAuthenticated) return;

        switch (user?.role) {
            case "admin":
                navigate("/admin/dashboard", {
                    replace: true,
                });
                break;
            case "faculty":
                navigate("/faculty/dashboard", {
                    replace: true,
                });
                break;
            case "student":
                navigate("/student/dashboard", {
                    replace: true,
                });
                break;
            default:
                navigate("/login", {
                    replace: true,
                });
        }
    }, [isAuthenticated, user, navigate]);

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-2">College Management System</h1>
                <p className="text-center text-gray-500 mb-8">Sign in to continue</p>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <div>
                        <label className="block mb-2 font-medium">Email</label>
                        <input
                            type="email"
                            autoComplete="email"
                            {...register("email")}
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Password</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            {...register("password")}
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loginMutation.isPending ? (
                            <span>Signing in...</span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;