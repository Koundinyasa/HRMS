import { Menu, UserCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SeparationNavbar from "../components/SeparationNavbar";
import SeparationStatusTimeline from "../components/SeparationStatusTimeline";

import { useSeparationManagement } from "../hooks/useSeparationManagement";

export default function StatusPage() {
  const {
    separationStatus,
    isLoading,
    isError,
  } = useSeparationManagement();

  return (
    <div className="w-full">
      <SeparationNavbar />

      <Card className="mt-6 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
              <Menu className="h-5 w-5" />
              Separation Approval Hierarchy
            </CardTitle>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Employee
              <UserCircle2 className="h-6 w-6" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">
                Loading separation status...
              </p>
            </div>
          ) : isError ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-red-500">
                Failed to load separation status.
              </p>
            </div>
          ) : !separationStatus ? (
            <div className="flex h-40 items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  No Resignation Found
                </h3>

                <p className="mt-2 text-muted-foreground">
                  You have not submitted any resignation request.
                </p>
              </div>
            </div>
          ) : (
            <SeparationStatusTimeline
              request={separationStatus}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}