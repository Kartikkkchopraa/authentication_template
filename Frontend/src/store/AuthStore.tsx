import { create } from "zustand";
import axios from "axios";

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    setAccessToken: (token: string | null) => void;
    initializeAuth: () => Promise<void>;
    logout: () => void;
}

interface RefreshResponse {
    accessToken: string;
}

const AuthStore = create<AuthState>((set) => ({
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,

    setAccessToken: (token) => {
        set({
            accessToken: token,
            isAuthenticated: token !== null
        });
    },

    initializeAuth: async () => {
        try {
            const response = await axios.get<RefreshResponse>(
                "http://localhost:3000/api/auth/refresh",
                {
                    withCredentials: true
                }
            );

            set({
                accessToken: response.data.accessToken,
                isAuthenticated: true,
                isLoading: false
            });

        } catch {
            set({
                accessToken: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    },

    logout: () => {
        set({
            accessToken: null,
            isAuthenticated: false
        });
    }
}));

export default AuthStore;