import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import * as authService from '../services/auth.service'
import { storage } from '../utils/storage'

type User = {
    id: number;
    name: string;
    email: string;
    role: "admin" | "faculty" | "student";
    createdAt: string;
    updatedAt: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    const login = async (email: string, password: string) => {
        const response = await authService.login({
            email,
            password,
        });

        storage.setToken(response.token);
        storage.setUser(response.user);

        setUser(response.user);
    };

    const logout = () => {
        storage.clearAuth();

        setUser(null);
    };

    useEffect(() => {
        const loadUser = async () => {
            const token = storage.getToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await authService.getCurrentUser();
                setUser(response.user);
            } catch {
                storage.clearAuth();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};