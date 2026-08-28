import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>

               
                <Route
                    path="/"
                    element={<Navigate to="/register" replace />}
                />

                
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
