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
    <div
      className="w-full min-h-screen bg-[#f3f7fb]"
      style={{ fontFamily: "Urbanist Variable, Urbanist, sans-serif" }}
    >
      <SeparationNavbar />
      

      <Card className="mt-2 shadow-sm">
        

        <CardContent className="pt-2">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-gray-500">
                Loading separation status...
              </p>
            </div>
          ) : isError ? (
            <div className="flex h-40 items-center justify-center">
             <p className="text-sm text-red-500">
                Failed to load separation status.
              </p>
            </div>
          ) : !separationStatus ? (
           <div className="w-full rounded-xl border border-gray-300 bg-white shadow-sm">
              <div className="flex h-40 items-center justify-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  No Resignation Found
                </h3>

               <p className="mt-2 text-sm text-gray-500">
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