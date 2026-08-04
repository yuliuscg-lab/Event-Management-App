import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { Role } from "../types/auth.types";

interface ProtectedRouteProps {
    allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace/>;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        const redirectPath = user.role === "CUSTOMER" ? "/" : "/organizer/portal";
        return <Navigate to={redirectPath} replace/>;
    }

    return <Outlet/>;
}