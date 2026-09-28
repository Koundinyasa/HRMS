import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
// import {
//   CalendarDays,
//   HelpCircle,
// } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import SeparationNavbar from "../components/SeparationNavbar";
import SubmitDialog from "../components/SubmitDialog";

import DateField from "../../leave/components/DateField";

import { useSeparationManagement } from "../hooks/useSeparationManagement";
import { validateResignation } from "../validations/resignationvalidation";

export default function ResignationPage() {
  const navigate = useNavigate();
  const { domain } = useParams();

  const { submitRequest, isSubmitting } = useSeparationManagement();

  const [requestedLastWorkingDate, setRequestedLastWorkingDate] = useState("");

  const [reason, setReason] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value) {
      setRequestedLastWorkingDate("");
      return;
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(value)) {
      return;
    }

    const year = value.substring(0, 4);

    if (year.length !== 4) {
      return;
    }

    setRequestedLastWorkingDate(value);
  };

  /**
   * Validate before opening dialog
   */
  const handleSubmit = () => {
    if (requestedLastWorkingDate) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;

      if (!datePattern.test(requestedLastWorkingDate)) {
        toast.error("Please enter a valid date with a 4-digit year.");
        return;
      }

      const year = Number(requestedLastWorkingDate.substring(0, 4));

      if (year < 1000 || year > 9999) {
        toast.error("Year must contain exactly 4 digits.");
        return;
      }
    }
    const error = validateResignation({
      requestedLastWorkingDate: requestedLastWorkingDate || null,
      reason,
    });

    if (error) {
      toast.error(error);
      return;
    }

    setDialogOpen(true);
  };

  /**
   * Submit resignation
   */
  const handleConfirm = async () => {
    try {
      await submitRequest({
        requestedLastWorkingDate: requestedLastWorkingDate || null,
        reason,
      });

      setDialogOpen(false);

      setRequestedLastWorkingDate("");
      setReason("");

      navigate(`/${domain}/employee/separation/status`);
    } catch {
      setDialogOpen(false);
    }
  };

  return (
    <div
      className="
        flex
        min-h-screen
        w-full
        min-w-0
        flex-col
        overflow-x-hidden
        bg-slate-100
      "
    >
      <SeparationNavbar />

      <div className="mt-4 min-w-0 px-3 sm:mt-6 sm:px-4 md:px-6 lg:mt-8 lg:px-8">
        <Card className="mx-auto w-full min-w-0 max-w-4xl overflow-visible rounded-xl border! border-black! shadow-sm ring-1! ring-black!">
          <CardHeader className="px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
            <CardTitle className="text-2xl font-bold">
              Resignation Request
            </CardTitle>

            <CardDescription className="text-base">
              Submit your resignation request for approval.
            </CardDescription>
          </CardHeader>

          <CardContent className="w-full min-w-0 space-y-6 px-4 pb-6 sm:space-y-8 sm:px-6 sm:pb-8 lg:px-8">
            {/* Requested Last Working Date */}
            <div className="w-full min-w-0 space-y-2">
              <Label
                htmlFor="lastWorkingDate"
                className="flex items-center gap-1.5 text-sm sm:text-base"
              >
                <Calendar className="h-4 w-4 text-slate-500" />
                Requested Last Working Date
              </Label>

              {/* ✅ CHANGED — replaced native <Input type="date"> with the custom DateField component (same one used in Leave Apply). Value/onChange still work with the same ISO "YYYY-MM-DD" string, so no other logic changed. */}
              <DateField
                id="lastWorkingDate"
                value={requestedLastWorkingDate}
                onChange={setRequestedLastWorkingDate}
                inputClassName="h-11 w-full min-w-0 max-w-full rounded-lg text-sm sm:text-base border border-slate-300 focus-visible:border-slate-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none"
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-slate-500" />
                Reason <span className="text-red-600">*</span>
              </Label>

              <Textarea
                id="reason"
                rows={8}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter your reason for resignation..."
                className="
  min-h-[150px]
  resize-none
  rounded-lg
  border
  border-slate-300
  bg-background
  px-4
  py-3
  text-sm
  outline-none
  placeholder:text-muted-foreground
  focus-visible:border-slate-400
  focus-visible:outline-none
  focus-visible:ring-0
  focus-visible:shadow-none
"
              />
            </div>

            {/* Submit Button */}
            <Button
              className="h-12 w-full rounded-lg bg-orange-500 text-white hover:bg-orange-600"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <SubmitDialog
        open={dialogOpen}
        loading={isSubmitting}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
