import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AssetNavbar from "../components/AssetNavbar";
import { useAssetManagement } from "../hooks/useAssetManagement";

export default function AssignedAssets() {
  const { historySection } = useAssetManagement();

  const records = historySection?.records ?? [];
  const headers = records[0]?.fields ?? [];

  return (
    <div className="space-y-5">
      <AssetNavbar />

      <Card>
        <CardHeader>
          <CardTitle>Assigned Assets</CardTitle>

          <CardDescription>
            Assets that have been approved and allocated to you.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {records.length === 0 ? (
            <div className="py-10 text-center">
              <h3 className="font-medium">No assigned assets found</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Approved and allocated assets will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    {headers.map((field) => (
                      <th
                        key={field.label}
                        className="px-3 py-3 font-medium"
                      >
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {records.map((record, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b last:border-0"
                    >
                      {record.fields.map((field) => (
                        <td
                          key={field.label}
                          className="px-3 py-3"
                        >
                          {field.value != null && field.value !== ""
                            ? String(field.value)
                            : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}