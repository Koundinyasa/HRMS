import { Routes, Route } from "react-router-dom";
import DashboardPage from "@/features/admin/dashboard/pages/DashboardPage";
import AdminLayout from "@/features/admin/components/AdminLayout";

export default function AdminRoutes() {
  return (
    <Routes>

      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}


// // AdminRoutes.jsx
// import AdminLayout from "@/features/admin/components/AdminLayout";
// import DashboardPage from "@/features/admin/dashboard/pages/DashboardPage";
// import { Route } from "react-router-dom";

// export default function AdminRoutes() {
//   return (
//     <Route  element={<AdminLayout />}>
//       <Route path="dashboard" element={<DashboardPage />} />
//     </Route>
//   );
// }