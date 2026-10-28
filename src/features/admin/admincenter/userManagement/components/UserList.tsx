// import { FiEdit2 } from "react-icons/fi";
// import { useUserList } from "../hooks/useUserList";
// import { ROWS_PER_PAGE_OPTIONS } from "../constants/userManagementConstants";

// const UserList = () => {
//   const {
//     users,
//     loading,
//     totalRecords,
//     totalPages,
//     visiblePages,
//     rowsPerPage,
//     setRowsPerPage,
//     currentPage,
//     setCurrentPage,
//   } = useUserList();

//   return (
//     <div className="bg-white rounded-xl shadow-md">
//       {/* Table */}
//       <table className="w-full">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="text-left p-4">User Name</th>
//             <th className="text-left p-4">Contact</th>
//             <th className="text-center p-4">Active</th>
//             <th className="text-left p-4">Payroll</th>
//             <th className="text-center p-4">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan={5} className="text-center text-gray-400 p-8">
//                 Loading users…
//               </td>
//             </tr>
//           ) : (
//             users.map((user) => (
//               <tr key={user.id} className="border-t hover:bg-gray-50">
//                 <td className="p-4 font-medium">{user.userName}</td>
//                 <td className="p-4">
//                   <div>{user.email}</div>
//                   <div className="text-gray-500 text-sm">Mob {user.mobile}</div>
//                 </td>
//                 <td className="p-4 text-center">
//                   <span
//                     className={`px-3 py-1 rounded-md text-sm font-medium ${
//                       user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {user.active ? "Yes" : "No"}
//                   </span>
//                 </td>
//                 <td className="p-4">{user.payroll}</td>
//                 <td className="p-4">
//                   <div className="flex justify-center">
//                     <button className="text-gray-500 hover:text-gray-700">
//                       <FiEdit2 size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Pagination Footer */}
//       <div className="flex items-center justify-between px-5 py-4 border-t">
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <span>Rows per page</span>
//           <select
//             value={rowsPerPage}
//             onChange={(e) => setRowsPerPage(Number(e.target.value))}
//             className="border rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-violet-500"
//           >
//             {ROWS_PER_PAGE_OPTIONS.map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-3 text-sm text-gray-600">
//           <span>
//             1 to {rowsPerPage} of {totalRecords}
//           </span>

//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               className="w-8 h-8 flex items-center justify-center rounded-md border hover:bg-gray-100"
//             >
//               &lt;
//             </button>

//             {visiblePages.map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
//                   currentPage === page
//                     ? "bg-violet-100 text-violet-600 font-medium"
//                     : "hover:bg-gray-100"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}

//             <span className="px-1">...</span>

//             <button
//               onClick={() => setCurrentPage(totalPages)}
//               className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
//                 currentPage === totalPages
//                   ? "bg-violet-100 text-violet-600 font-medium"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               {totalPages}
//             </button>

//             <button
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               className="w-8 h-8 flex items-center justify-center rounded-md border hover:bg-gray-100"
//             >
//               &gt;
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserList;

import { FiEdit2 } from "react-icons/fi";
import { useUserList } from "../hooks/useUserList";
import { ROWS_PER_PAGE_OPTIONS } from "../constants/userManagementConstants";

const UserList = () => {
  const {
    users,
    loading,
    totalRecords,
    totalPages,
    visiblePages,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
  } = useUserList();

  return (
    <div className="bg-white rounded-xl shadow-md">
      {/* Table */}
      {/* <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"> */}
        <div>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">User Name</th>
              <th className="text-left p-4">Contact</th>
              <th className="text-center p-4">Active</th>
              <th className="text-left p-4">Payroll</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 p-8">
                  Loading users…
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{user.userName}</td>
                  <td className="p-4">
                    <div>{user.email}</div>
                    <div className="text-gray-500 text-sm">Mob {user.mobile}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-4">{user.payroll}</td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <button className="text-gray-500 hover:text-gray-700">
                        <FiEdit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-5 py-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-violet-500"
          >
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>
            1 to {rowsPerPage} of {totalRecords}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-md border hover:bg-gray-100"
            >
              &lt;
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                  currentPage === page
                    ? "bg-violet-100 text-violet-600 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <span className="px-1">...</span>

            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                currentPage === totalPages
                  ? "bg-violet-100 text-violet-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {totalPages}
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-md border hover:bg-gray-100"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;