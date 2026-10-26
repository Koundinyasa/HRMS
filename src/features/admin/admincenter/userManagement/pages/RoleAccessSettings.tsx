import RolePermissionsGrid from "../components/RolePermissionsGrid";
import { useRoleAccessSettings } from "../hooks/useRoleAccessSettings";

const RoleAccessSettings = () => {
  const { roleList, selectedRole, setSelectedRole } = useRoleAccessSettings();

  return (
    <div className="space-y-3">
      {/* Role Selection */}
      <div className="bg-white rounded-xl shadow-sm px-4 py-2.5 flex justify-end items-center gap-2">
        <label className="text-xs font-medium text-gray-700">Role</label>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-52 h-9 border border-gray-300 rounded-md px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-violet-500"
        >
          {roleList.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 h-9 rounded-md text-sm font-medium transition"
        >
          Update
        </button>
      </div>

      {/* Permissions */}
      <RolePermissionsGrid selectedRole={selectedRole} />
    </div>
  );
};

export default RoleAccessSettings;
