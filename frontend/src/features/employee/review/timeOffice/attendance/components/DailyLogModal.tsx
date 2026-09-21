// import { useEffect, useState } from "react";
// import { Eye, EyeOff, X, KeyRound } from "lucide-react";
// import { toast } from "react-toastify";

// import { useChangePasswordMutation } from "@/features/auth/api/authApi";

// interface ChangePasswordModalProps {
//   open: boolean;
//   onClose: () => void;
// }

// export default function ChangePasswordModal({
//   open,
//   onClose,
// }: ChangePasswordModalProps) {
//   const [currentPassword, setCurrentPassword] =
//     useState("");

//   const [newPassword, setNewPassword] =
//     useState("");

//   const [confirmPassword, setConfirmPassword] =
//     useState("");

//   const [showCurrentPassword, setShowCurrentPassword] =
//     useState(false);

//   const [showNewPassword, setShowNewPassword] =
//     useState(false);

//   const [showConfirmPassword, setShowConfirmPassword] =
//     useState(false);

//   const [
//     changePassword,
//     { isLoading },
//   ] = useChangePasswordMutation();

//   // =========================
//   // Reset Form
//   // =========================

//   useEffect(() => {
//     if (!open) {
//       setCurrentPassword("");
//       setNewPassword("");
//       setConfirmPassword("");

//       setShowCurrentPassword(false);
//       setShowNewPassword(false);
//       setShowConfirmPassword(false);
//     }
//   }, [open]);

//   // =========================
//   // Close Modal
//   // =========================

//   const handleClose = () => {
//     if (isLoading) {
//       return;
//     }

//     setCurrentPassword("");
//     setNewPassword("");
//     setConfirmPassword("");

//     setShowCurrentPassword(false);
//     setShowNewPassword(false);
//     setShowConfirmPassword(false);

//     onClose();
//   };

//   // =========================
//   // Submit
//   // =========================

//   const handleSubmit = async (
//     event: React.FormEvent<HTMLFormElement>
//   ) => {
//     event.preventDefault();

//     // -------------------------
//     // Current Password
//     // -------------------------

//     if (!currentPassword.trim()) {
//       toast.error(
//         "Please enter your current password."
//       );
//       return;
//     }

//     // -------------------------
//     // New Password
//     // -------------------------

//     if (!newPassword.trim()) {
//       toast.error(
//         "Please enter your new password."
//       );
//       return;
//     }

//     // -------------------------
//     // Confirm Password
//     // -------------------------

//     if (!confirmPassword.trim()) {
//       toast.error(
//         "Please confirm your new password."
//       );
//       return;
//     }

//     // -------------------------
//     // Password Match
//     // -------------------------

//     if (newPassword !== confirmPassword) {
//       toast.error(
//         "New password and confirm password do not match."
//       );
//       return;
//     }

//     // -------------------------
//     // Same Password
//     // -------------------------

//     if (currentPassword === newPassword) {
//       toast.error(
//         "New password must be different from current password."
//       );
//       return;
//     }

//     try {
//       const response = await changePassword({
//         currentPassword,
//         newPassword,
//         confirmPassword,
//       }).unwrap();

//       if (response?.success) {
//         toast.success(
//           response.message ||
//             "Password changed successfully."
//         );

//         handleClose();
//       } else {
//         toast.error(
//           response?.message ||
//             "Failed to change password."
//         );
//       }
//     } catch (error: any) {
//       console.error(
//         "Change password failed:",
//         error
//       );

//       const errorMessage =
//         error?.data?.message ||
//         error?.error ||
//         "Failed to change password. Please try again.";

//       toast.error(errorMessage);
//     }
//   };

//   // =========================
//   // Modal Closed
//   // =========================

//   if (!open) {
//     return null;
//   }

//   return (
//     <div
//       className="
//         fixed
//         inset-0
//         z-[99999]
//         flex
//         items-center
//         justify-center
//         bg-black/50
//         p-4
//       "
//       onMouseDown={(event) => {
//         if (
//           event.target === event.currentTarget &&
//           !isLoading
//         ) {
//           handleClose();
//         }
//       }}
//     >
//       {/* =========================
//           Modal
//       ========================= */}

//       <div
//         className="
//           relative
//           w-full
//           max-w-md
//           rounded-xl
//           bg-white
//           shadow-2xl
//         "
//         onMouseDown={(event) => {
//           event.stopPropagation();
//         }}
//       >
//         {/* =========================
//             Header
//         ========================= */}

//         <div
//           className="
//             flex
//             items-center
//             justify-between
//             border-b
//             border-slate-200
//             px-5
//             py-4
//           "
//         >
//           <div className="flex items-center gap-3">
//             <div
//               className="
//                 flex
//                 h-10
//                 w-10
//                 items-center
//                 justify-center
//                 rounded-full
//                 bg-blue-50
//                 text-blue-600
//               "
//             >
//               <KeyRound
//                 size={20}
//                 strokeWidth={2}
//               />
//             </div>

//             <div>
//               <h2
//                 className="
//                   text-lg
//                   font-semibold
//                   text-[#1E3A5F]
//                 "
//               >
//                 Change Password
//               </h2>

//               <p
//                 className="
//                   text-xs
//                   text-slate-500
//                 "
//               >
//                 Update your account password
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={handleClose}
//             disabled={isLoading}
//             className="
//               rounded-md
//               p-2
//               text-slate-400
//               transition
//               hover:bg-slate-100
//               hover:text-slate-700
//               disabled:cursor-not-allowed
//               disabled:opacity-50
//             "
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* =========================
//             Form
//         ========================= */}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-5 p-5"
//         >
//           {/* =========================
//               Current Password
//           ========================= */}

//           <div>
//             <label
//               htmlFor="currentPassword"
//               className="
//                 mb-1.5
//                 block
//                 text-sm
//                 font-medium
//                 text-slate-700
//               "
//             >
//               Current Password
//               <span className="ml-1 text-red-500">
//                 *
//               </span>
//             </label>

//             <div className="relative">
//               <input
//                 id="currentPassword"
//                 name="currentPassword"
//                 type={
//                   showCurrentPassword
//                     ? "text"
//                     : "password"
//                 }
//                 value={currentPassword}
//                 onChange={(event) =>
//                   setCurrentPassword(
//                     event.target.value
//                   )
//                 }
//                 placeholder="Enter current password"
//                 disabled={isLoading}
//                 autoComplete="current-password"
//                 className="
//                   h-11
//                   w-full
//                   rounded-md
//                   border
//                   border-slate-300
//                   bg-white
//                   px-3
//                   pr-11
//                   text-sm
//                   text-slate-800
//                   outline-none
//                   transition
//                   placeholder:text-slate-400
//                   focus:border-blue-500
//                   focus:ring-2
//                   focus:ring-blue-100
//                   disabled:cursor-not-allowed
//                   disabled:bg-slate-50
//                 "
//               />

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowCurrentPassword(
//                     !showCurrentPassword
//                   )
//                 }
//                 disabled={isLoading}
//                 className="
//                   absolute
//                   right-0
//                   top-0
//                   flex
//                   h-11
//                   w-11
//                   items-center
//                   justify-center
//                   text-slate-400
//                   hover:text-slate-600
//                 "
//                 aria-label={
//                   showCurrentPassword
//                     ? "Hide current password"
//                     : "Show current password"
//                 }
//               >
//                 {showCurrentPassword ? (
//                   <EyeOff size={18} />
//                 ) : (
//                   <Eye size={18} />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* =========================
//               New Password
//           ========================= */}

//           <div>
//             <label
//               htmlFor="newPassword"
//               className="
//                 mb-1.5
//                 block
//                 text-sm
//                 font-medium
//                 text-slate-700
//               "
//             >
//               New Password
//               <span className="ml-1 text-red-500">
//                 *
//               </span>
//             </label>

//             <div className="relative">
//               <input
//                 id="newPassword"
//                 name="newPassword"
//                 type={
//                   showNewPassword
//                     ? "text"
//                     : "password"
//                 }
//                 value={newPassword}
//                 onChange={(event) =>
//                   setNewPassword(
//                     event.target.value
//                   )
//                 }
//                 placeholder="Enter new password"
//                 disabled={isLoading}
//                 autoComplete="new-password"
//                 className="
//                   h-11
//                   w-full
//                   rounded-md
//                   border
//                   border-slate-300
//                   bg-white
//                   px-3
//                   pr-11
//                   text-sm
//                   text-slate-800
//                   outline-none
//                   transition
//                   placeholder:text-slate-400
//                   focus:border-blue-500
//                   focus:ring-2
//                   focus:ring-blue-100
//                   disabled:cursor-not-allowed
//                   disabled:bg-slate-50
//                 "
//               />

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowNewPassword(
//                     !showNewPassword
//                   )
//                 }
//                 disabled={isLoading}
//                 className="
//                   absolute
//                   right-0
//                   top-0
//                   flex
//                   h-11
//                   w-11
//                   items-center
//                   justify-center
//                   text-slate-400
//                   hover:text-slate-600
//                 "
//                 aria-label={
//                   showNewPassword
//                     ? "Hide new password"
//                     : "Show new password"
//                 }
//               >
//                 {showNewPassword ? (
//                   <EyeOff size={18} />
//                 ) : (
//                   <Eye size={18} />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* =========================
//               Confirm Password
//           ========================= */}

//           <div>
//             <label
//               htmlFor="confirmPassword"
//               className="
//                 mb-1.5
//                 block
//                 text-sm
//                 font-medium
//                 text-slate-700
//               "
//             >
//               Confirm Password
//               <span className="ml-1 text-red-500">
//                 *
//               </span>
//             </label>

//             <div className="relative">
//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type={
//                   showConfirmPassword
//                     ? "text"
//                     : "password"
//                 }
//                 value={confirmPassword}
//                 onChange={(event) =>
//                   setConfirmPassword(
//                     event.target.value
//                   )
//                 }
//                 placeholder="Confirm new password"
//                 disabled={isLoading}
//                 autoComplete="new-password"
//                 className="
//                   h-11
//                   w-full
//                   rounded-md
//                   border
//                   border-slate-300
//                   bg-white
//                   px-3
//                   pr-11
//                   text-sm
//                   text-slate-800
//                   outline-none
//                   transition
//                   placeholder:text-slate-400
//                   focus:border-blue-500
//                   focus:ring-2
//                   focus:ring-blue-100
//                   disabled:cursor-not-allowed
//                   disabled:bg-slate-50
//                 "
//               />

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowConfirmPassword(
//                     !showConfirmPassword
//                   )
//                 }
//                 disabled={isLoading}
//                 className="
//                   absolute
//                   right-0
//                   top-0
//                   flex
//                   h-11
//                   w-11
//                   items-center
//                   justify-center
//                   text-slate-400
//                   hover:text-slate-600
//                 "
//                 aria-label={
//                   showConfirmPassword
//                     ? "Hide confirm password"
//                     : "Show confirm password"
//                 }
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff size={18} />
//                 ) : (
//                   <Eye size={18} />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* =========================
//               Password Match Message
//           ========================= */}

//           {confirmPassword.length > 0 &&
//             newPassword !== confirmPassword && (
//               <p className="text-xs text-red-500">
//                 Passwords do not match.
//               </p>
//             )}

//           {confirmPassword.length > 0 &&
//             newPassword === confirmPassword && (
//               <p className="text-xs text-green-600">
//                 Passwords match.
//               </p>
//             )}

//           {/* =========================
//               Buttons
//           ========================= */}

//           <div
//             className="
//               flex
//               flex-col-reverse
//               gap-3
//               pt-2
//               sm:flex-row
//               sm:justify-end
//             "
//           >
//             <button
//               type="button"
//               onClick={handleClose}
//               disabled={isLoading}
//               className="
//                 rounded-md
//                 border
//                 border-slate-300
//                 px-5
//                 py-2.5
//                 text-sm
//                 font-medium
//                 text-slate-600
//                 transition
//                 hover:bg-slate-50
//                 disabled:cursor-not-allowed
//                 disabled:opacity-50
//               "
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="
//                 rounded-md
//                 bg-blue-600
//                 px-5
//                 py-2.5
//                 text-sm
//                 font-medium
//                 text-white
//                 transition
//                 hover:bg-blue-700
//                 disabled:cursor-not-allowed
//                 disabled:opacity-50
//               "
//             >
//               {isLoading
//                 ? "Changing Password..."
//                 : "Change Password"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import {
  CalendarClock,
  Plane,
  CalendarCheck2,
  Plus,
  Fingerprint,
  X,
  Clock,
  Timer,
  MapPin,
  Camera,
  Pencil,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

export interface PunchLogEntry {
  type: "In" | "Out";
  time: string;
  entryType?: string;
  location?: string;
  hasSelfie?: boolean;
}

export interface DailyLogModalProps {
  open: boolean;
  onClose: () => void;

  employeeName: string;
  employeeId: string;
  date: string;
  status: string;

  firstHalfStatus?: string;
  secondHalfStatus?: string;

  lateIn?: string;
  earlyOut?: string;
  totalHours?: string;
  overtime?: string;

  permissions?: string[];

  // API punch data
  punches?: PunchLogEntry[];

  // API loading
  punchesLoading?: boolean;

  onCorrectStatus?: () => void;
  onApplyLeave?: () => void;
  onAssignShift?: () => void;
  onAddPermission?: () => void;
  onAddPunch?: () => void;
  onEditPunch?: (
    index: number,
  ) => void;
}

// =========================================================
// DAILY LOG MODAL
// =========================================================

export default function DailyLogModal({
  open,
  onClose,

  employeeName,
  employeeId,
  date,
  status,

  firstHalfStatus = status,
  secondHalfStatus = status,

  lateIn = "00:00",
  earlyOut = "00:00",
  totalHours = "00:00",
  overtime = "00:00",

  permissions = [],

  // IMPORTANT:
  // These now come from API
  punches = [],

  punchesLoading = false,

  onCorrectStatus,
  onApplyLeave,
  onAssignShift,
  onAddPermission,
  onAddPunch,
  onEditPunch,
}: DailyLogModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      {/* =====================================================
          MODAL
      ===================================================== */}

      <div
        className="
          relative
          flex
          max-h-[90vh]
          w-full
          max-w-[1225px]
          flex-col
          overflow-hidden
          rounded-xl
          bg-white
          shadow-2xl
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Daily Log of{" "}
              {employeeName || "-"}{" "}
              on {date}
            </h2>

            {employeeId && (
              <p className="mt-0.5 text-xs text-slate-400">
                Employee ID:{" "}
                {employeeId}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            BODY
        ===================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="mb-4 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={
                onCorrectStatus
              }
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <CalendarClock
                size={16}
              />

              Correct Status
            </button>

            <button
              type="button"
              onClick={
                onApplyLeave
              }
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plane size={16} />

              Apply Leave
            </button>

            <button
              type="button"
              onClick={
                onAssignShift
              }
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <CalendarCheck2
                size={16}
              />

              Assign Shift
            </button>

            <button
              type="button"
              onClick={
                onAddPermission
              }
              className="ml-auto inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={16} />

              Permission
            </button>

            <button
              type="button"
              onClick={onAddPunch}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Fingerprint
                size={16}
              />

              Punch
            </button>
          </div>

          {/* =================================================
              FH / SH
          ================================================= */}

          <div className="mb-4 flex gap-2">

            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              FH:{" "}
              {firstHalfStatus ||
                "-"}
            </span>

            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              SH:{" "}
              {secondHalfStatus ||
                "-"}
            </span>
          </div>

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[395px_minmax(0,1fr)]">

            {/* ===============================================
                LEFT SIDE
            =============================================== */}

            <div>

              {/* =============================================
                  STAT BOXES
              ============================================= */}

              <div className="grid grid-cols-2 gap-3">

                {/* Late In */}

                <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 shadow-sm">
                  <div>
                    <div className="text-sm font-semibold text-red-500">
                      {lateIn}
                    </div>

                    <div className="text-xs text-slate-500">
                      Late In
                    </div>
                  </div>

                  <Clock
                    size={18}
                    className="text-red-400"
                  />
                </div>

                {/* Early Out */}

                <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 shadow-sm">
                  <div>
                    <div className="text-sm font-semibold text-red-500">
                      {earlyOut}
                    </div>

                    <div className="text-xs text-slate-500">
                      Early Out
                    </div>
                  </div>

                  <Clock
                    size={18}
                    className="text-red-400"
                  />
                </div>

                {/* Total Hours */}

                <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 shadow-sm">
                  <div>
                    <div className="text-sm font-semibold text-blue-600">
                      {totalHours}
                    </div>

                    <div className="text-xs text-slate-500">
                      Total Hours
                    </div>
                  </div>

                  <Clock
                    size={18}
                    className="text-blue-500"
                  />
                </div>

                {/* OT */}

                <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 shadow-sm">
                  <div>
                    <div className="text-sm font-semibold text-blue-600">
                      {overtime}
                    </div>

                    <div className="text-xs text-slate-500">
                      OT
                    </div>
                  </div>

                  <Timer
                    size={18}
                    className="text-blue-500"
                  />
                </div>
              </div>

              {/* =============================================
                  PERMISSIONS
              ============================================= */}

              <div className="mt-3 rounded-lg border border-slate-200 px-4 py-3 shadow-sm">

                <div className="mb-1 text-sm font-semibold text-slate-700">
                  Permissions
                </div>

                {permissions.length ===
                0 ? (
                  <button
                    type="button"
                    onClick={
                      onAddPermission
                    }
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Permissions Not Found
                  </button>
                ) : (
                  <ul className="list-disc pl-5 text-sm text-slate-600">
                    {permissions.map(
                      (
                        permission,
                        index,
                      ) => (
                        <li
                          key={index}
                        >
                          {
                            permission
                          }
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* ===============================================
                RIGHT SIDE - PUNCH TABLE
            =============================================== */}

            <div className="overflow-hidden rounded-lg border border-slate-200">

              <table className="w-full table-fixed border-collapse text-sm">

                {/* TABLE HEADER */}

                <thead className="bg-blue-100">

                  <tr>

                    <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600">
                      Punch Type
                    </th>

                    <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600">
                      Punch Time
                    </th>

                    <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600">
                      Entry Type
                    </th>

                    <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600">
                      Location
                    </th>

                    <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600">
                      Selfie
                    </th>

                    <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}

                <tbody>

                  {/* LOADING */}

                  {punchesLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-sm text-slate-400"
                      >
                        Loading punches...
                      </td>
                    </tr>
                  ) : punches.length ===
                    0 ? (

                    /* NO DATA */

                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-sm text-slate-400"
                      >
                        No punches recorded
                        for this day.
                      </td>
                    </tr>

                  ) : (

                    /* API DATA */

                    punches.map(
                      (
                        punch,
                        index,
                      ) => (
                        <tr
                          key={`${punch.time}-${index}`}
                          className="border-t border-slate-200 odd:bg-white even:bg-slate-50"
                        >

                          {/* Punch Type */}

                          <td
                            className={`px-3 py-3 font-medium ${
                              punch.type ===
                              "In"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {punch.type}
                          </td>

                          {/* Punch Time */}

                          <td className="px-3 py-3 text-slate-600">
                            {punch.time}
                          </td>

                          {/* Entry Type */}

                          <td className="px-3 py-3 text-slate-600">
                            {punch.entryType ||
                              "-"}
                          </td>

                          {/* Location */}

                          <td className="px-3 py-3 text-slate-500">

                            {punch.location ? (
                              <MapPin
                                size={16}
                                className="text-slate-500"
                              />
                            ) : (
                              "-"
                            )}

                          </td>

                          {/* Selfie */}

                          <td className="px-3 py-3 text-slate-500">

                            {punch.hasSelfie ? (
                              <Camera
                                size={16}
                              />
                            ) : (
                              "-"
                            )}

                          </td>

                          {/* Action */}

                          <td className="px-3 py-3">

                            <button
                              type="button"
                              onClick={() =>
                                onEditPunch?.(
                                  index,
                                )
                              }
                              className="text-blue-500 transition hover:text-blue-700"
                              aria-label="Edit punch"
                            >
                              <Pencil
                                size={16}
                              />
                            </button>

                          </td>

                        </tr>
                      ),
                    )
                  )}

                </tbody>

              </table>
            </div>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="flex shrink-0 justify-end border-t border-slate-200 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <X size={16} />

            Cancel
          </button>

        </div>
      </div>
    </div>
  );
}