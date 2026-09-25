import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import SeparationNavbar from "../components/SeparationNavbar";
import WithdrawDialog from "../components/WithdrawDialog";

import { useSeparationManagement } from "../hooks/useSeparationManagement";
import { validateWithdrawReason } from "../validations/withdrawvalidation";

export default function WithdrawPage() {
  const navigate = useNavigate();

  const { domain } = useParams();

  const {
    separationStatus,
    withdrawRequest,
    isWithdrawing,
  } = useSeparationManagement();

  const [reason, setReason] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  /**
   * Employee can withdraw only when request
   * is Submitted or Approved
   */
  const status =
    separationStatus?.OverallStatus?.toUpperCase();

  const canWithdraw =
    status === "SUBMITTED" ||
    status === "APPROVED";

  /**
   * Validate form before opening dialog
   */
  const handleSubmit = () => {
    const error =
      validateWithdrawReason(reason);

    if (error) {
      toast.error(error);
      return;
    }

    if (!separationStatus || !canWithdraw) {
      toast.error(
        "No active resignation request found."
      );
      return;
    }

    setDialogOpen(true);
  };

  /**
   * Confirm Withdraw
   */
  const handleConfirm = async () => {
    if (!separationStatus) return;

    try {
      await withdrawRequest({
        resignationId:
          separationStatus.Id,
        withdrawalReason: reason,
      });

      setDialogOpen(false);

      setReason("");

      navigate(
        `/${domain}/employee/separation/status`
      );
    } catch {
      // Toast handled in hook
    }
  };

  /**
   * No Active Request
   */
  if (!separationStatus || !canWithdraw) {
    return (
      <div
        className="w-full"
        style={{ fontFamily: "Urbanist Variable, Urbanist, sans-serif" }}
      >
        <SeparationNavbar />

        <div className="mt-8 px-8">
          <Card className="mx-auto max-w-6xl rounded-2xl border! border-slate-200! shadow-sm!">
            <CardContent className="flex min-h-[350px] flex-col items-center justify-center space-y-5 text-center">
              <h2 className="text-2xl font-bold">
                No Active Withdrawal Request
              </h2>

              <p className="max-w-md text-muted-foreground">
                There is no active resignation request
                available to withdraw.
              </p>

              <Button
                className="h-11 bg-orange-500 px-8 hover:bg-orange-600"
                onClick={() =>
                  navigate(
                    `/${domain}/employee/separation/status`
                  )
                }
              >
                Go to Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="w-full"
        style={{ fontFamily: "Urbanist Variable, Urbanist, sans-serif" }}
      >
        <SeparationNavbar />

        <div className="mt-8 px-8">
          <Card
  className="
    mx-auto
    w-full
    max-w-6xl
    rounded-2xl
    border!
    border-slate-200!
    bg-white
    shadow-sm!
  "
>
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-2xl font-bold">
                Withdraw Resignation
              </CardTitle>

              <CardDescription className="text-base">
                Submit a request to withdraw your
                resignation.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pb-8">
              {/* Withdrawal Reason */}
              <div className="space-y-2">
                <Label htmlFor="withdrawReason">
                  Withdrawal Reason{" "}
                  <span className="text-red-600">
                    *
                  </span>
                </Label>

                <Textarea
                  id="withdrawReason"
                  rows={8}
                  value={reason}
                  onChange={(e) =>
                    setReason(e.target.value)
                  }
                  placeholder="Enter the reason for withdrawing your resignation..."
                  className="min-h-[150px] resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Submit Button */}
              <Button
                className="h-12 w-full rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                onClick={handleSubmit}
                disabled={isWithdrawing}
              >
                {isWithdrawing
                  ? "Submitting..."
                  : "Withdraw Request"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <WithdrawDialog
        open={dialogOpen}
        loading={isWithdrawing}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirm}
      />
    </>
  );
}