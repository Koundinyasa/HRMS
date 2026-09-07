import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Search, History } from "lucide-react";
import ClassificationNavbar from "../components/ClassificationNavbar";
import AdditionalClassificationList from "../components/AdditionalClassificationList";
import EmptyStateIllustration from "../components/EmptyStateIllustration";
import { useAdditionalClassification } from "../hooks/useAdditionalClassification";

export default function AdditionalClassificationPage() {
  const {
    items, isLoading, usingFallback,
    selectedId, setSelectedId,
    isFormOpen, openAdd, openEdit, closeForm,
    form, setField, submit, isSaving,
    remove,
  } = useAdditionalClassification();

  const [search, setSearch] = useState("");

  const filteredItems = search.trim()
    ? items.filter(
        (i) =>
          i.Name.toLowerCase().includes(search.trim().toLowerCase()) ||
          i.Tag.toLowerCase().includes(search.trim().toLowerCase())
      )
    : items;

  return (
    <div className="w-full">
      <ClassificationNavbar
        rightSlot={
          <>
            <div className="relative w-full sm:w-auto">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-9 w-full sm:w-48 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              />
            </div>
            <button
              type="button"
              onClick={openAdd}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
            >
              <Plus size={16} /> Add New
            </button>
            <button
              type="button"
              aria-label="History"
              className="w-9 h-9 rounded-full border flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              <History size={16} />
            </button>
          </>
        }
      />

      <p className="px-4 sm:px-6 mt-4 text-xs text-gray-400">Classifications / Additional Classifications</p>

      {usingFallback && (
        <div className="mx-4 sm:mx-6 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700">
          Showing preview data — the additional classifications API isn't live on the backend yet, so this list
          isn't connected to real data and edits won't be saved.
        </div>
      )}

      <div className="mt-4 px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
          {/* Left: classification list panel */}
          <div className="bg-[#F5F3FF] rounded-2xl border border-violet-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Classification</h3>
              <button
                type="button"
                onClick={openAdd}
                aria-label="Add classification"
                className="w-8 h-8 rounded-lg border border-violet-200 bg-white flex items-center justify-center text-violet-600 hover:bg-violet-50"
              >
                <Plus size={16} />
              </button>
            </div>

            {isLoading ? (
              <p className="text-sm text-muted-foreground py-4">Loading...</p>
            ) : (
              <AdditionalClassificationList
                items={filteredItems}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onEdit={openEdit}
                onDelete={remove}
              />
            )}
          </div>

          {/* Right: detail / form panel */}
          <div className="bg-white rounded-2xl border shadow-sm min-h-[320px] sm:min-h-[420px] flex items-center justify-center">
            {isFormOpen ? (
              <div className="w-full max-w-md p-4 sm:p-8 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="classification-name">Classification Name</Label>
                  <Input
                    id="classification-name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="e.g. Department"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classification-tag">Tag</Label>
                  <Input
                    id="classification-tag"
                    value={form.tag}
                    onChange={(e) => setField("tag", e.target.value)}
                    placeholder="e.g. Department"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={closeForm}>Cancel</Button>
                  <Button onClick={submit} disabled={isSaving} className="bg-violet-600 hover:bg-violet-700 text-white">
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyStateIllustration label="Additional Classification" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
