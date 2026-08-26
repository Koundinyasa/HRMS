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

      <Card className="mt-2 shadow-sm">
        

        <CardContent className="pt-2">
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