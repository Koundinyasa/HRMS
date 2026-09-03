import { useState } from "react";
import type { SalaryStructureDefinition } from "../types/classificationTypes";

const DEFAULT_STRUCTURES: SalaryStructureDefinition[] = [
  { Id: 1, Name: "Salary Structure", Tag: "Gross", IsSystemDefined: true },
  { Id: 2, Name: "CTC Salary Structure", Tag: "CTC", IsSystemDefined: false },
  { Id: 3, Name: "Test Structure", Tag: "Component Wise", IsSystemDefined: false },
];

let nextId = 4;

export const useSalaryStructureDefinitions = () => {
  const [structures, setStructures] = useState<SalaryStructureDefinition[]>(DEFAULT_STRUCTURES);
  const [selectedId, setSelectedId] = useState<number>(DEFAULT_STRUCTURES[0].Id);
  const [editingStructure, setEditingStructure] = useState<SalaryStructureDefinition | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SalaryStructureDefinition | null>(null);

  const selectedStructure = structures.find((s) => s.Id === selectedId) ?? structures[0];

  const openAdd = () => {
    setIsAdding(true);
    setEditingStructure({ Id: 0, Name: "", Tag: "" });
  };

  const openEdit = (structure: SalaryStructureDefinition) => {
    setIsAdding(false);
    setEditingStructure(structure);
  };

  const closeEdit = () => {
    setEditingStructure(null);
    setIsAdding(false);
  };

  const saveEdit = () => {
    if (!editingStructure || !editingStructure.Name.trim()) return;
    if (isAdding) {
      const created = { ...editingStructure, Id: nextId++ };
      setStructures((prev) => [...prev, created]);
      setSelectedId(created.Id);
    } else {
      setStructures((prev) => prev.map((s) => (s.Id === editingStructure.Id ? editingStructure : s)));
    }
    closeEdit();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setStructures((prev) => prev.filter((s) => s.Id !== deleteTarget.Id));
    if (selectedId === deleteTarget.Id) {
      setSelectedId(structures.find((s) => s.Id !== deleteTarget.Id)?.Id ?? 0);
    }
    setDeleteTarget(null);
  };

  const cloneStructure = () => {
    const source = selectedStructure;
    if (!source) return;
    const created = { ...source, Id: nextId++, Name: `${source.Name} (Copy)` };
    setStructures((prev) => [...prev, created]);
    setSelectedId(created.Id);
  };

  return {
    structures,
    selectedId,
    setSelectedId,
    selectedStructure,
    editingStructure,
    setEditingStructure,
    isAdding,
    openAdd,
    openEdit,
    closeEdit,
    saveEdit,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    cloneStructure,
  };
};
