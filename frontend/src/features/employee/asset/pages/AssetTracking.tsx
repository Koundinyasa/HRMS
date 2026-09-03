
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