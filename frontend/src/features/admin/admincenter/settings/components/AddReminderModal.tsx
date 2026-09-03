// import { useState, useEffect } from "react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// interface AddReminderModalProps {
//   open: boolean;
//   onClose: () => void;
// }

// export default function AddReminderModal({
//   open,
//   onClose,
// }: AddReminderModalProps) {
//   const [reminderName, setReminderName] = useState("");
//   const [reminderType, setReminderType] = useState("Birthday");
//   const [days, setDays] = useState("7");

//   // Reset form when modal closes
//   useEffect(() => {
//     if (!open) {
//       setReminderName("");
//       setReminderType("Birthday");
//       setDays("7");
//     }
//   }, [open]);

//   function handleSave() {
//     if (!reminderName.trim()) {
//       alert("Please enter reminder name");
//       return;
//     }

//     // Temporary - later you can connect this to API
//     console.log({
//       reminderName,
//       reminderType,
//       days: Number(days),
//     });

//     onClose();
//   }

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <Card className="w-[500px] rounded-2xl p-6 shadow-xl">
//         <h2 className="mb-6 text-xl font-semibold">Add Reminder</h2>

//         <div className="space-y-5">
//           <div>
//             <Label>Reminder Name</Label>
//             <Input
//               value={reminderName}
//               onChange={(e) => setReminderName(e.target.value)}
//               placeholder="Enter reminder name"
//               className="mt-2"
//             />
//           </div>

//           <div>
//             <Label>Reminder Type</Label>
//             <select
//               value={reminderType}
//               onChange={(e) => setReminderType(e.target.value)}
//               className="mt-2 h-10 w-full rounded-md border px-3"
//             >
//               <option>Birthday</option>
//               <option>Work Anniversary</option>
//               <option>Confirmation Date</option>
//               <option>Last Working Day</option>
//               <option>Probation Completion</option>
//               <option>Retirement</option>
//               <option>Interview Reminder</option>
//               <option>Subscription Reminder</option>
//               <option>Passport Expiry</option>
//             </select>
//           </div>

//           <div>
//             <Label>Reminder Before (Days)</Label>
//             <Input
//               type="number"
//               value={days}
//               onChange={(e) => setDays(e.target.value)}
//               className="mt-2"
//               min={1}
//             />
//           </div>

//           <div className="flex justify-end gap-3 pt-4">
//             <Button variant="outline" onClick={onClose}>
//               Cancel
//             </Button>

//             <Button
//               onClick={handleSave}
//               className="bg-violet-600 hover:bg-violet-700"
//             >
//               Save
//             </Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }
















import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddReminderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddReminderModal({ open, onClose }: AddReminderModalProps) {
  const [reminderName, setReminderName] = useState("");
  const [reminderType, setReminderType] = useState("Birthday");
  const [days, setDays] = useState("7");

  useEffect(() => {
    if (!open) {
      setReminderName("");
      setReminderType("Birthday");
      setDays("7");
    }
  }, [open]);

  function handleSave() {
    if (!reminderName.trim()) {
      alert("Please enter reminder name");
      return;
    }
    console.log({
      reminderName,
      reminderType,
      days: Number(days),
    });
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-[500px] rounded-2xl p-5 shadow-xl sm:p-6">
        <h2 className="mb-6 text-xl font-semibold">Add Reminder</h2>

        <div className="space-y-5">
          <div>
            <Label>Reminder Name</Label>
            <Input
              value={reminderName}
              onChange={(e) => setReminderName(e.target.value)}
              placeholder="Enter reminder name"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Reminder Type</Label>
            <select
              value={reminderType}
              onChange={(e) => setReminderType(e.target.value)}
              className="mt-2 h-10 w-full rounded-md border px-3"
            >
              <option>Birthday</option>
              <option>Work Anniversary</option>
              <option>Confirmation Date</option>
              <option>Last Working Day</option>
              <option>Probation Completion</option>
              <option>Retirement</option>
              <option>Interview Reminder</option>
              <option>Subscription Reminder</option>
              <option>Passport Expiry</option>
            </select>
          </div>

          <div>
            <Label>Reminder Before (Days)</Label>
            <Input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="mt-2"
              min={1}
            />
          </div>

          <div className="flex flex-col-reverse justify-end gap-3 pt-4 sm:flex-row">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="w-full bg-violet-600 hover:bg-violet-700 sm:w-auto"
            >
              Save
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}