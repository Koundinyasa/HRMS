import { Outlet } from "react-router-dom";

const UserManagementPage = () => {
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
};

export default UserManagementPage;
