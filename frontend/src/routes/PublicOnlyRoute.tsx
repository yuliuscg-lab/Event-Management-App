import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet } from "react-router";

export const PublicOnlyRoute = () => {
    const { user, isAuthenticated } = useAuthStore();
    
    if (!isAuthenticated && user) {
        const redirectPath = user.role === "CUSTOMER" ? "/" : "/organizer/portal";
        return <Navigate to={redirectPath} replace/>
    }

    return <Outlet/>
}