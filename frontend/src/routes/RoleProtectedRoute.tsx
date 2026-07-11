import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

type Role = "admin" | "faculty" | "student";

type RoleProtectedRouteProps = {
    allowedRoles: Role[];
};

const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
    const { loading, isAuthenticated, user } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        switch (user.role) {
            case "admin":
                return <Navigate to="/admin/dashboard" replace />;
            case "faculty":
                return <Navigate to="/faculty/dashboard" replace />;
            case "student":
                return <Navigate to="/student/dashboard" replace />;
            default:
                return <Navigate to="/login" replace />;
        }
    }

    return <Outlet />;
};

export default RoleProtectedRoute;