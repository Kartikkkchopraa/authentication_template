import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/register";
import VerifyEmail from "./pages/VerifyEmail";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* Default route */}
                <Route
                    path="/"
                    element={<Navigate to="/register" replace />}
                />

                {/* Authentication routes */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/verify-email"
                    element={<VerifyEmail />}
                />

            </Routes>
        </BrowserRouter>
    );
};

export default App;
