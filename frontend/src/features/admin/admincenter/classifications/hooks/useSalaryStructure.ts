import { useEffect, useMemo, useState } from "react";
import type {
  SalaryComponent,
  SalaryComponentType,
  StructureBasedOn,
  StructureCalculationType,
  StructureEntry,
} from "../types/classificationTypes";

const entryKey = (structureId: number, componentId: number) => `${structureId}:${componentId}`;

const defaultEntryFor = (component: SalaryComponent, order: number): StructureEntry => ({
  ComponentId: component.Id,
  CalculationType: "Lumpsum",
  EffectiveFrom: "Feb/2026",
  EffectiveTill: "Till Date",
  BasedOn: "Pay Days",
  TdsRef: component.ComponentName,
  Order: order,
});

interface StructureDefault {
  componentName: string;
  type: SalaryComponentType;
  calculationType: StructureCalculationType;
  calculationDetail?: string;
  basedOn: StructureBasedOn;
  tdsRef: string;
  order: number;
}

/**
 * Seed data for structures that don't have anything saved yet. No backend endpoint exists
 * for structure-component assignment, so this mirrors the two structures shown in the
 * design ("Salary Structure" / Gross, and "CTC Salary Structure").
 */
const STRUCTURE_DEFAULTS: Record<number, StructureDefault[]> = {
  1: [
    { componentName: "Basic", type: "Earnings", calculationType: "Lumpsum", basedOn: "Pay Days", tdsRef: "Basic", order: 1 },
  ],
  2: [
    { componentName: "Special Allowance", type: "Earnings", calculationType: "Lumpsum", basedOn: "Pay Days", tdsRef: "", order: 1 },
    { componentName: "Basic", type: "Earnings", calculationType: "Formula", calculationDetail: "Basic", basedOn: "Pay Days", tdsRef: "Basic", order: 2 },
    { componentName: "HRA", type: "Earnings", calculationType: "Formula", calculationDetail: "HRA", basedOn: "Pay Days", tdsRef: "House Rent Allowance", order: 3 },
    { componentName: "Health Insurance", type: "Deduction", calculationType: "Every Month", basedOn: "Independent", tdsRef: "None", order: 1 },
  ],
};

export const useSalaryStructure = (allComponents: SalaryComponent[], selectedStructureId: number) => {
  const [entriesByKey, setEntriesByKey] = useState<Record<string, StructureEntry>>({});
  const [assignedByStructure, setAssignedByStructure] = useState<Record<number, number[]>>({});
  const [seededStructures, setSeededStructures] = useState<Set<number>>(new Set());
  const [structureTab, setStructureTab] = useState<SalaryComponentType>("Earnings");
  const [showTillDate, setShowTillDate] = useState<"Show Till Date" | "Show All">("Show Till Date");
  const [editingEntry, setEditingEntry] = useState<StructureEntry | null>(null);
  const [editingComponentId, setEditingComponentId] = useState<number | null>(null);

  // Seed each known structure's defaults once its required components are actually loaded —
  // allComponents starts empty while the API call (or fallback) is in flight.
  useEffect(() => {
    Object.entries(STRUCTURE_DEFAULTS).forEach(([idStr, defaults]) => {
      const structureId = Number(idStr);
      if (seededStructures.has(structureId)) return;

      const resolved = defaults.map((d) => ({
        def: d,
        component: allComponents.find(
          (c) => c.ComponentName.toLowerCase() === d.componentName.toLowerCase() && c.Type === d.type
        ),
      }));
      if (resolved.some((r) => !r.component)) return; // wait until all are available

      const assignedIds = resolved.map((r) => r.component!.Id);
      const newEntries: Record<string, StructureEntry> = {};
      resolved.forEach(({ def, component }) => {
        newEntries[entryKey(structureId, component!.Id)] = {
          ComponentId: component!.Id,
          CalculationType: def.calculationType,
          CalculationDetail: def.calculationDetail,
          EffectiveFrom: "Feb/2026",
          EffectiveTill: "Till Date",
          BasedOn: def.basedOn,
          TdsRef: def.tdsRef,
          Order: def.order,
        };
      });

      setAssignedByStructure((prev) => ({ ...prev, [structureId]: assignedIds }));
      setEntriesByKey((prev) => ({ ...prev, ...newEntries }));
      setSeededStructures((prev) => new Set(prev).add(structureId));
    });
  }, [allComponents, seededStructures]);

  const assignedIds = assignedByStructure[selectedStructureId] ?? [];
  const assignedComponents = useMemo(
    () => allComponents.filter((c) => assignedIds.includes(c.Id)),
    [allComponents, assignedIds]
  );

  const earningsCount = useMemo(
    () => assignedComponents.filter((c) => c.Type === "Earnings").length,
    [assignedComponents]
  );
  const deductionsCount = useMemo(
    () => assignedComponents.filter((c) => c.Type === "Deduction").length,
    [assignedComponents]
  );

  const rows = useMemo(() => {
    const filtered = assignedComponents
      .filter((c) => c.Type === structureTab)
      .slice()
      .sort((a, b) => a.SortOrder - b.SortOrder);

    return filtered.map((component, index) => {
      const key = entryKey(selectedStructureId, component.Id);
      const entry = entriesByKey[key] ?? defaultEntryFor(component, index + 1);
      return { component, entry };
    });
  }, [assignedComponents, structureTab, entriesByKey, selectedStructureId]);

  const upsertEntry = (componentId: number, entry: StructureEntry) => {
    setEntriesByKey((prev) => ({ ...prev, [entryKey(selectedStructureId, componentId)]: entry }));
  };

  const setOrder = (component: SalaryComponent, order: number) => {
    const rowIndex = rows.findIndex((r) => r.component.Id === component.Id);
    const key = entryKey(selectedStructureId, component.Id);
    const fallback = entriesByKey[key] ?? defaultEntryFor(component, rowIndex + 1);
    upsertEntry(component.Id, { ...fallback, Order: order });
  };

  const openEditEntry = (component: SalaryComponent, order: number) => {
    const key = entryKey(selectedStructureId, component.Id);
    setEditingComponentId(component.Id);
    setEditingEntry(entriesByKey[key] ?? defaultEntryFor(component, order));
  };

  const closeEditEntry = () => {
    setEditingEntry(null);
    setEditingComponentId(null);
  };

  const saveEditEntry = () => {
    if (!editingEntry || editingComponentId == null) return;
    upsertEntry(editingComponentId, editingEntry);
    closeEditEntry();
  };

  /** Assign a component (not yet in this structure) to the currently selected structure. */
  const assignComponent = (component: SalaryComponent) => {
    setAssignedByStructure((prev) => {
      const current = prev[selectedStructureId] ?? [];
      if (current.includes(component.Id)) return prev;
      return { ...prev, [selectedStructureId]: [...current, component.Id] };
    });
  };

  return {
    structureTab,
    setStructureTab,
    showTillDate,
    setShowTillDate,
    earningsCount,
    deductionsCount,
    rows,
    setOrder,
    editingEntry,
    setEditingEntry,
    openEditEntry,
    closeEditEntry,
    saveEditEntry,
    assignComponent,
  };
};
