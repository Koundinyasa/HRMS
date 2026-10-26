import { FaSearch, FaHistory, FaPlus } from "react-icons/fa";
import RoleList from "./RoleList";
import RoleAccessSettings from "../pages/RoleAccessSettings";
import UserList from "./UserList";
import EmployeeList from "./EmployeeList";
import AddUserModal from "./AddUserModal";
import { useRoleMaster } from "../hooks/useRoleMaster";

const RoleMaster = () => {
  const {
    tabs,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    showAddUser,
    userForm,
    updateUserForm,
    handleAddButtonClick,
    handleSaveUser,
    closeAddUser,
  } = useRoleMaster();

  return (
    <div className="space-y-5">
      {/* TOP NAVIGATION */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* TABS */}
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-violet-600 text-white"
                    : "text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* SEARCH */}
            {activeTab !== "Role Access Settings" &&
              activeTab !== "User" &&
              activeTab !== "Employee" && (
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 w-56 border rounded-lg outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                  />
                </div>
              )}

            {/* ADD BUTTON */}
            {activeTab !== "Role Access Settings" && (
              <button
                onClick={handleAddButtonClick}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium whitespace-nowrap"
              >
                <FaPlus />
                {activeTab === "User"
                  ? "Add User"
                  : activeTab === "Employee"
                  ? "Resend Invitation"
                  : "Add Role Master"}
              </button>
            )}

            {/* HISTORY */}
            <button className="border rounded-lg p-2 hover:bg-gray-100 text-gray-600">
              <FaHistory />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div>
        {activeTab === "Roles" && <RoleList />}
        {activeTab === "Role Access Settings" && <RoleAccessSettings />}
        {activeTab === "Employee" && <EmployeeList />}
        {activeTab === "User" && <UserList />}
      </div>

      {/* ADD USER MODAL */}
      {showAddUser && (
        <AddUserModal
          userForm={userForm}
          updateUserForm={updateUserForm}
          onClose={closeAddUser}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default RoleMaster;
