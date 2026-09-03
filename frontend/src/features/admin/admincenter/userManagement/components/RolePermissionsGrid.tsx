import PermissionCheckbox from "./PermissionCheckbox";
import { useRolePermissionsGrid } from "../hooks/useRolePermissionsGrid";

type RolePermissionsGridProps = {
  selectedRole: string;
};

const RolePermissionsGrid = ({ selectedRole }: RolePermissionsGridProps) => {
  const { loading, tabs, activeTab, handleTabChange, permissions, togglePermission, permissionKeys, colors } =
    useRolePermissionsGrid(selectedRole);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      {/* MODULE TABS */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === tab
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* PERMISSION TABLE */}
      {/* <div className="overflow-x-auto border border-gray-200 rounded-xl"> */}
     <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full border-collapse">
          {/* <thead>
            <tr className="bg-[#F6F3FF]"> */}
          <thead>
  <tr className="bg-[#F6F3FF] sticky top-0 z-10">
    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-700 bg-[#F6F3FF]">Pages</th>
    <th className="text-center px-2 py-2.5 text-xs font-medium text-gray-600 bg-[#F6F3FF]">
      <div className="flex items-center justify-center gap-2">
        Create
        <input type="checkbox" className="w-3.5 h-3.5 accent-violet-600" />
      </div>
    </th>
    <th className="text-center px-2 py-2.5 text-xs font-medium text-gray-600 bg-[#F6F3FF]">
      <div className="flex items-center justify-center gap-2">
        Read
        <input type="checkbox" className="w-3.5 h-3.5 accent-violet-600" />
      </div>
    </th>
    <th className="text-center px-2 py-2.5 text-xs font-medium text-gray-600 bg-[#F6F3FF]">
      <div className="flex items-center justify-center gap-2">
        Update
        <input type="checkbox" className="w-3.5 h-3.5 accent-violet-600" />
      </div>
    </th>
    <th className="text-center px-2 py-2.5 text-xs font-medium text-gray-600 bg-[#F6F3FF]">
      <div className="flex items-center justify-center gap-2">
        Delete
        <input type="checkbox" className="w-3.5 h-3.5 accent-violet-600" />
      </div>
    </th>
    <th className="text-center px-2 py-2.5 text-xs font-medium text-gray-600 bg-[#F6F3FF]">
      <div className="flex items-center justify-center gap-2">
        Audit
        <input type="checkbox" className="w-3.5 h-3.5 accent-violet-600" />
      </div>
    </th>
    <th className="text-center px-2 py-2.5 text-xs font-medium text-gray-600 bg-[#F6F3FF]">
      <div className="flex items-center justify-center gap-2">
        Select All
        <input type="checkbox" className="w-3.5 h-3.5 accent-violet-600" />
      </div>
    </th>
  </tr>
</thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-6 text-xs">
                  Loading permissions…
                </td>
              </tr>
            ) : permissions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-6 text-xs">
                  No pages configured for this module yet.
                </td>
              </tr>
            ) : (
              permissions.map((row, rowIndex) => (
                <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-xs text-gray-700">{row.page}</td>

                  {permissionKeys.map((permission) => (
                    <td key={permission} className="text-center px-2 py-2.5">
                      <div className="flex justify-center">
                        <PermissionCheckbox
                          checked={row[permission]}
                          color={colors[permission]}
                          onClick={() => togglePermission(rowIndex, permission)}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolePermissionsGrid;
