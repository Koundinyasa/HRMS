import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { ComponentType } from "react";
import Login from "../features/auth/pages/Login";

const LoginComponent = Login as ComponentType<any>;

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;