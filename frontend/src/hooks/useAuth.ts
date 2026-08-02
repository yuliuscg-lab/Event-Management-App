import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore"
import { authService, LoginPayload, RegisterPayload } from "../api/auth";

export const useAuth = () => {
    const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: (data: LoginPayload) => authService.login(data),
        onSuccess: (res) => {
            setAuth(res.data!.user, res.data!.accessToken);
        }
    });

    const registerMutation = useMutation({
        mutationFn: (data:RegisterPayload) => authService.register(data),
    });

    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            clearAuth();
        }
    });

    const useProfileQuery = () => useQuery({
        queryKey: ["auth-me"],
        queryFn: async () => {
            const res = await authService.me();
            return res.data;
        },
        enabled: isAuthenticated,
    });

    return {
        user,
        isAuthenticated,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        useProfileQuery,
    };
};