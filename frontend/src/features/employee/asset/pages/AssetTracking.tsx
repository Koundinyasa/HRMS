
import { Menu, UserCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AssetStatusTimeline from "../components/AssetStatusTimeline";
import { useAssetManagement } from "../hooks/useAssetManagement";
import AssetNavbar from "../components/AssetNavbar";

export default function AssetTracking() {
  const { myPendingRequests } = useAssetManagement();

  return (
    <div>
      <AssetNavbar />

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-3 text-3xl font-bold tracking-tight">
              <Menu size={20} />
              Asset Management Approval Hierarchy
            </CardTitle>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Employee <UserCircle2 size={24} />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {myPendingRequests.length === 0 ? (
            <div className="py-12 text-center">
              <h3 className="font-medium">No requests found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Please submit an asset request first.
              </p>
            </div>
          ) : (
            <AssetStatusTimeline requests={myPendingRequests} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}