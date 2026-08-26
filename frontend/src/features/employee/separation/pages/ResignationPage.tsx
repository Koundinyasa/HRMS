import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import SeparationNavbar from "../components/SeparationNavbar";
import SubmitDialog from "../components/SubmitDialog";

import { useSeparationManagement } from "../hooks/useSeparationManagement";
import { validateResignation } from "../validations/resignationvalidation";

export default function ResignationPage() {
  const navigate = useNavigate();
  const { domain } = useParams();

  const { submitRequest, isSubmitting } =
    useSeparationManagement();

  const [
    requestedLastWorkingDate,
    setRequestedLastWorkingDate,
  ] = useState("");

  const [reason, setReason] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  /**
   * Validate before opening dialog
   */
  const handleSubmit = () => {
    const error = validateResignation({
      requestedLastWorkingDate:
        requestedLastWorkingDate || null,
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
        requestedLastWorkingDate:
          requestedLastWorkingDate || null,
        reason,
      });

      setDialogOpen(false);

      setRequestedLastWorkingDate("");
      setReason("");

      navigate(
        `/${domain}/employee/separation/status`
      );
    } catch {
      setDialogOpen(false);
    }
  };

  return (
    <div className="w-full">
      <SeparationNavbar />

      <div className="mt-4 min-w-0 px-3 sm:mt-6 sm:px-4 md:px-6 lg:mt-8 lg:px-8">
        <Card className="mx-auto w-full min-w-0 max-w-6xl overflow-visible rounded-xl border shadow-sm sm:rounded-2xl">
          <CardHeader className="px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
            <CardTitle className="text-2xl font-bold">
              Resignation Request
            </CardTitle>

            <CardDescription className="text-base">
              Submit your resignation request for
              approval.
            </CardDescription>
          </CardHeader>

          <CardContent className="w-full min-w-0 space-y-6 px-4 pb-6 sm:space-y-8 sm:px-6 sm:pb-8 lg:px-8">
            {/* Requested Last Working Date */}
            <div className="w-full min-w-0 space-y-2">
              <Label
                htmlFor="lastWorkingDate"
                className="text-sm sm:text-base"
              >
                Requested Last Working Date
              </Label>

              <Input
                id="lastWorkingDate"
                type="date"
                value={requestedLastWorkingDate}
                onChange={(e) =>
                  setRequestedLastWorkingDate(e.target.value)
                }
                className="
      h-11
      w-full
      min-w-0
      max-w-full
      rounded-lg
      text-sm
      sm:text-base
    "
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason{" "}
                <span className="text-red-600">
                  *
                </span>
              </Label>

              <Textarea
                id="reason"
                rows={8}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter your reason for resignation..."
                className="min-h-[150px] resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <Button
              className="h-12 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Request"}
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