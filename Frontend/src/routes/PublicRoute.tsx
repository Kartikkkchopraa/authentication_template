import { type ReactNode } from "react";
import {Navigate} from "react-router-dom";
import AuthStore from "../store/AuthStore";

const PublicRoute = ({ children }: { children: ReactNode }) => {

  

    const {isLoading, isAuthenticated} = AuthStore();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/profile" replace/>

        //<Navigate> is designed specifically for the situation where the rendered result should cause a redirect.
    }

    return children;
};

export default PublicRoute;