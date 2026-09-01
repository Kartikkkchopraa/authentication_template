import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import AuthInitializer from "./auth/AuthInitializer";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Profile from "./pages/Profile";


const App = () => {
    return (
        <BrowserRouter>

            <AuthInitializer />

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/register" replace />}
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/verify-email"
                    element={
                        <PublicRoute>
                            <VerifyEmail />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile/>
                        </PrivateRoute>
                    }
                />

                

            </Routes>

        </BrowserRouter>
    );
};

export default App;