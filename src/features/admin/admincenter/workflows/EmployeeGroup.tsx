// import { useState } from "react";
// import {
//   Pencil,
//   Users,
//   Trash2,
//   ChevronDown,
//   Clock3,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import type { EmployeeGroup } from "./types/workflowTypes";
// import { validateEmployeeGroup } from "./validations/workflowValidations";

// const INITIAL_GROUPS: EmployeeGroup[] = [
//   {
//     id: "1",
//     name: "All Employees",
//   },
// ];

// export default function EmployeeGroup() {
//   const [groups, setGroups] =
//     useState<EmployeeGroup[]>(INITIAL_GROUPS);

//   const [showAddModal, setShowAddModal] =
//     useState(false);

//   const [newGroupName, setNewGroupName] =
//     useState("");

//   const [error, setError] = useState("");

//   const handleCreateGroup = () => {
//     const result = validateEmployeeGroup(
//       newGroupName,
//       groups
//     );

//     if (!result.isValid) {
//       setError(result.error || "");
//       return;
//     }

//     const newGroup: EmployeeGroup = {
//       id: Date.now().toString(),
//       name: newGroupName.trim(),
//     };

//     setGroups((prev) => [...prev, newGroup]);

//     setNewGroupName("");
//     setError("");
//     setShowAddModal(false);
//   };

//   const handleDeleteGroup = (id: string) => {
//     setGroups((prev) =>
//       prev.filter((group) => group.id !== id)
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Top Actions */}
//       <div className="flex items-center justify-end gap-3">
//         <Button
//           onClick={() => setShowAddModal(true)}
//           className="h-10 rounded-xl bg-violet-600 px-5 text-sm font-medium hover:bg-violet-700"
//         >
//           Add Group
//           <ChevronDown className="ml-2 h-4 w-4" />
//         </Button>

//         <Button
//           size="icon"
//           variant="outline"
//           className="h-10 w-10 rounded-xl"
//         >
//           <Clock3 className="h-4 w-4 text-gray-500" />
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
//         <div className="grid grid-cols-12 bg-[#F3F0FF] px-6 py-4 text-sm font-semibold text-gray-700">
//           <div className="col-span-10">
//             Filter Name
//           </div>

//           <div className="col-span-2 text-right">
//             Actions
//           </div>
//         </div>

//         {groups.length === 0 ? (
//           <div className="px-6 py-12 text-center text-sm text-gray-400">
//             No employee groups found.
//           </div>
//         ) : (
//           groups.map((group) => (
//             <div
//               key={group.id}
//               className="grid grid-cols-12 items-center border-t border-gray-100 px-6 py-4 hover:bg-gray-50"
//             >
//               <div className="col-span-10 text-sm font-medium text-gray-800">
//                 {group.name}
//               </div>

//               <div className="col-span-2 flex justify-end gap-3">
//                 <button className="text-gray-400 hover:text-violet-600">
//                   <Pencil className="h-4 w-4" />
//                 </button>

//                 <button className="text-gray-400 hover:text-violet-600">
//                   <Users className="h-4 w-4" />
//                 </button>

//                 <button
//                   onClick={() =>
//                     handleDeleteGroup(group.id)
//                   }
//                   className="text-gray-400 hover:text-red-500"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Add Group Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
//             <h2 className="mb-5 text-lg font-semibold">
//               Add Employee Group
//             </h2>

//             <div className="mb-5">
//               <label className="text-sm font-medium text-gray-700">
//                 Group Name{" "}
//                 <span className="text-red-500">*</span>
//               </label>

//               <Input
//                 value={newGroupName}
//                 onChange={(e) => {
//                   setNewGroupName(e.target.value);
//                   setError("");
//                 }}
//                 placeholder="Enter group name"
//                 className="mt-2"
//               />

//               {error && (
//                 <p className="mt-2 text-xs text-red-500">
//                   {error}
//                 </p>
//               )}
//             </div>

//             <div className="flex justify-end gap-3">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setShowAddModal(false);
//                   setNewGroupName("");
//                   setError("");
//                 }}
//               >
//                 Cancel
//               </Button>

//               <Button
//                 onClick={handleCreateGroup}
//                 className="bg-violet-600 hover:bg-violet-700"
//               >
//                 Add Group
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



















import { useState } from "react";
import {
  Pencil,
  Users,
  Trash2,
  ChevronDown,
  Clock3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { EmployeeGroup } from "./types/workflowTypes";
import { validateEmployeeGroup } from "./validations/workflowValidations";

const INITIAL_GROUPS: EmployeeGroup[] = [
  {
    id: "1",
    name: "All Employees",
  },
];

export default function EmployeeGroup() {
  const [groups, setGroups] =
    useState<EmployeeGroup[]>(INITIAL_GROUPS);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [error, setError] = useState("");

  const handleCreateGroup = () => {
    const result = validateEmployeeGroup(newGroupName, groups);

    if (!result.isValid) {
      setError(result.error || "");
      return;
    }

    const newGroup: EmployeeGroup = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
    };

    setGroups((prev) => [...prev, newGroup]);
    setNewGroupName("");
    setError("");
    setShowAddModal(false);
  };

  const handleDeleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((group) => group.id !== id));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          onClick={() => setShowAddModal(true)}
          className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-medium hover:bg-violet-700 sm:px-5"
        >
          Add Group
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 shrink-0 rounded-xl"
        >
          <Clock3 className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {/* Table / List */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Header — desktop */}
        <div className="hidden grid-cols-12 bg-[#F3F0FF] px-4 py-3 text-sm font-semibold text-gray-700 sm:grid sm:px-6 sm:py-4">
          <div className="col-span-10">Filter Name</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {groups.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-400 sm:px-6 sm:py-12">
            No employee groups found.
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 hover:bg-gray-50 sm:grid sm:grid-cols-12 sm:items-center sm:gap-0 sm:px-6"
            >
              {/* Name */}
              <div className="text-sm font-medium text-gray-800 sm:col-span-10">
                <span className="mb-1 block text-xs font-normal text-gray-400 sm:hidden">
                  Filter Name
                </span>
                {group.name}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 sm:col-span-2 sm:justify-end">
                <button
                  type="button"
                  className="text-gray-400 hover:text-violet-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="text-gray-400 hover:text-violet-600"
                >
                  <Users className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteGroup(group.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Group Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
            <h2 className="mb-5 text-lg font-semibold">
              Add Employee Group
            </h2>

            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700">
                Group Name <span className="text-red-500">*</span>
              </label>

              <Input
                value={newGroupName}
                onChange={(e) => {
                  setNewGroupName(e.target.value);
                  setError("");
                }}
                placeholder="Enter group name"
                className="mt-2"
              />

              {error && (
                <p className="mt-2 text-xs text-red-500">{error}</p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setNewGroupName("");
                  setError("");
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                onClick={handleCreateGroup}
                className="w-full bg-violet-600 hover:bg-violet-700 sm:w-auto"
              >
                Add Group
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}