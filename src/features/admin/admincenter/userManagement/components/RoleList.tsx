// import { FiEdit2, FiTrash2 } from "react-icons/fi";
// import { useRoleList } from "../hooks/useRoleList";

// const RoleList = () => {
//   const { modules, activeModule, setActiveModule, filteredRoles, loading } = useRoleList();

//   return (
//     <div className="bg-white rounded-xl shadow-md">
//       {/* Module Tabs */}
//       <div className="flex gap-4 px-5 py-4 border-b bg-gray-50">
//         {modules.map((module) => (
//           <button
//             key={module}
//             onClick={() => setActiveModule(module)}
//             className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
//               activeModule === module
//                 ? "bg-white border border-violet-600 text-violet-600"
//                 : "text-gray-700 hover:text-violet-600"
//             }`}
//           >
//             {module}
//           </button>
//         ))}
//       </div>

//       {/* Table
//       <table className="w-full">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="text-left p-4">Role Name</th>
//             <th className="text-left p-4">Module</th>
//             <th className="text-center p-4">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan={3} className="text-center text-gray-400 p-8">
//                 Loading roles…
//               </td>
//             </tr>
//           ) : (
//             filteredRoles.map((role) => (
//               <tr key={role.id} className="border-t hover:bg-gray-50">
//                 <td className="p-4">{role.roleName}</td>
//                 <td className="p-4">{role.module}</td>
//                 <td className="p-4">
//                   <div className="flex justify-center gap-3">
//                     <button className="text-gray-500 hover:text-gray-700">
//                       <FiEdit2 size={16} />
//                     </button>
//                     <button className="text-red-500 hover:text-red-600">
//                       <FiTrash2 size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table> */}
//       {/* Table */}
//       <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//         <table className="w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="text-left p-4">Role Name</th>
//               <th className="text-left p-4">Module</th>
//               <th className="text-center p-4">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={3} className="text-center text-gray-400 p-8">
//                   Loading roles…
//                 </td>
//               </tr>
//             ) : (
//               filteredRoles.map((role) => (
//                 <tr key={role.id} className="border-t hover:bg-gray-50">
//                   <td className="p-4">{role.roleName}</td>
//                   <td className="p-4">{role.module}</td>
//                   <td className="p-4">
//                     <div className="flex justify-center gap-3">
//                       <button className="text-gray-500 hover:text-gray-700">
//                         <FiEdit2 size={16} />
//                       </button>
//                       <button className="text-red-500 hover:text-red-600">
//                         <FiTrash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RoleList;

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useRoleList } from "../hooks/useRoleList";

const RoleList = () => {
  const { modules, activeModule, setActiveModule, filteredRoles, loading } = useRoleList();

  return (
    <div className="bg-white rounded-xl shadow-md">
      {/* Module Tabs */}
      <div className="flex gap-4 px-5 py-4 border-b bg-gray-50">
        {modules.map((module) => (
          <button
            key={module}
            onClick={() => setActiveModule(module)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              activeModule === module
                ? "bg-white border border-violet-600 text-violet-600"
                : "text-gray-700 hover:text-violet-600"
            }`}
          >
            {module}
          </button>
        ))}
      </div>

      {/* Table */}
      {/* <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"> */}
        <div>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Role Name</th>
              <th className="text-left p-4">Module</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center text-gray-400 p-8">
                  Loading roles…
                </td>
              </tr>
            ) : (
              filteredRoles.map((role) => (
                <tr key={role.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{role.roleName}</td>
                  <td className="p-4">{role.module}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button className="text-gray-500 hover:text-gray-700">
                        <FiEdit2 size={16} />
                      </button>
                      <button className="text-red-500 hover:text-red-600">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleList;
