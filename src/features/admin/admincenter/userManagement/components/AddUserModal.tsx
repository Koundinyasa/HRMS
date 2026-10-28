import { FaTimesCircle, FaSave } from "react-icons/fa";
import { PAYROLL_ROLE_OPTIONS } from "../constants/userManagementConstants";
import type { AddUserPayload } from "../types/user.types";

type AddUserModalProps = {
  userForm: AddUserPayload;
  updateUserForm: (field: keyof AddUserPayload, value: string | boolean) => void;
  onClose: () => void;
  onSave: () => void;
};

const AddUserModal = ({ userForm, updateUserForm, onClose, onSave }: AddUserModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[380px] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Add User</h2>
        </div>

        {/* FORM */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">User Name</label>
            <input
              type="text"
              value={userForm.userName}
              onChange={(e) => updateUserForm("userName", e.target.value)}
              className="w-full h-9 px-3 rounded-md bg-[#edf3f7] border-none outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="abc@email.com"
              value={userForm.email}
              onChange={(e) => updateUserForm("email", e.target.value)}
              className="w-full h-9 px-3 rounded-md bg-[#edf3f7] border-none outline-none focus:ring-2 focus:ring-violet-500 text-sm placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Mobile<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="99XXXXXX99"
              value={userForm.mobile}
              onChange={(e) => updateUserForm("mobile", e.target.value)}
              className="w-full h-9 px-3 rounded-md bg-[#edf3f7] border-none outline-none focus:ring-2 focus:ring-violet-500 text-sm placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Payroll Role<span className="text-red-500">*</span>
            </label>
            <select
              value={userForm.payrollRole}
              onChange={(e) => updateUserForm("payrollRole", e.target.value)}
              className="w-full h-9 px-3 rounded-md bg-[#edf3f7] border-none outline-none focus:ring-2 focus:ring-violet-500 text-sm text-gray-600"
            >
              <option value=""></option>
              {PAYROLL_ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="activeUser"
              type="checkbox"
              checked={userForm.active}
              onChange={(e) => updateUserForm("active", e.target.checked)}
              className="w-4 h-4 accent-violet-600"
            />
            <label htmlFor="activeUser" className="text-xs text-gray-600">
              Active
            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-200 px-6 py-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="h-9 px-4 border border-gray-300 rounded-md text-sm text-gray-600 flex items-center gap-2 hover:bg-gray-50"
          >
            <FaTimesCircle size={13} />
            Close
          </button>

          <button
            onClick={onSave}
            className="h-9 px-5 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm flex items-center gap-2"
          >
            <FaSave size={13} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
