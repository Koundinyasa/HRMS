import { useState } from "react";
import { FileSpreadsheet, MapPin, Pencil, Plus, Search, Trash2 } from "lucide-react";
import MastersLayout from "./MastersLayout";
import { GEO_LOCATION_ROWS } from "../../constants/masters.mock";

export default function GeoLocationPage() {
  const [query, setQuery] = useState("");
  const rows = GEO_LOCATION_ROWS.filter((row) =>
    `${row.locationName} ${row.address}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <MastersLayout>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col">
        <div className="flex items-center justify-end gap-2 px-4 py-3 flex-wrap">
          <button type="button" title="Export to Excel" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-emerald-600">
            <FileSpreadsheet size={16} />
          </button>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              className="h-9 pl-8 pr-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-400"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="button" className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium flex items-center gap-1.5">
            <Plus size={14} /> Geolocation
          </button>
        </div>

        <div className="px-4 pb-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#EAF1FE]">
              <tr className="text-left">
                <th className="font-semibold text-slate-700 px-4 py-3">Location Name</th>
                <th className="font-semibold text-slate-700 px-4 py-3">Address</th>
                <th className="font-semibold text-slate-700 px-4 py-3">Location</th>
                <th className="font-semibold text-slate-700 px-4 py-3">Radius Range(meters)</th>
                <th className="font-semibold text-slate-700 px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.locationName} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">{row.locationName}</td>
                  <td className="px-4 py-3 text-slate-700">{row.address}</td>
                  <td className="px-4 py-3 text-red-500"><MapPin size={16} /></td>
                  <td className="px-4 py-3 text-slate-700">{row.radiusMeters}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-slate-400">
                      <button type="button" className="hover:text-emerald-600"><Pencil size={15} /></button>
                      <button type="button" className="hover:text-red-600"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">No locations found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MastersLayout>
  );
}
