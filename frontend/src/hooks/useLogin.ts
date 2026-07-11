import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { storage } from '../utils/storage'
import { useAuth } from "../context/AuthContext";
import type { LoginFormData } from "../validators/auth.validator";

export const useLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    return useMutation({
        mutationFn: async (data: LoginFormData) => {
            await login(data.email, data.password);
        },

        onSuccess: () => {
            toast.success("Login successful");

            const role = storage.getUser()?.role;

            switch (role) {
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
        },

        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Login failed");
        },
    });
};