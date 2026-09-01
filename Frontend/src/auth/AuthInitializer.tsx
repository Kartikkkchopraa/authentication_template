import { useEffect } from "react";
import AuthStore from "../store/AuthStore";

const AuthInitializer = () => {
    
    const {initializeAuth} = AuthStore();

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return null;
};

export default AuthInitializer;