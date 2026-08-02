import { authService } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react"

export const useInitAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { setAuth, clearAuth } = useAuthStore();

    useEffect(()=> {
        const initAuth = async () => {
            try {
                const refreshResponse = await authService.refresh();
                
                if(refreshResponse.data?.accessToken) {
                    const accessToken = refreshResponse.data.accessToken;
                    useAuthStore.getState().setAccessToken(accessToken);
                    const meResponse = await authService.me();
                    
                    if(meResponse.data) {
                        setAuth(meResponse.data, accessToken)
                    }
                }

            } catch (error) {
                clearAuth();
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, [setAuth, clearAuth]);
    return { isLoading };
}