import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";
import Login from "../features/auth/pages/Login";

// function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/login"
//           element={<Login />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default AppRoutes;

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;