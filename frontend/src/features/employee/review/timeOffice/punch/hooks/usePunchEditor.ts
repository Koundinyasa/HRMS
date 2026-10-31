
import { useState } from "react";
import type { SetStateAction } from "react";

import type {
  EditablePunch,
  PunchEdits,
  PunchRecord,
  UsePunchEditorResult,
} from "../types/punch.types";

export function usePunchEditor(
  punchRecords: PunchRecord[],
): UsePunchEditorResult {
  const recordSignature = JSON.stringify(
    punchRecords.map((record) => ({
      punchId: record.punchId,
      originalTime: record.originalTime,
      correctedTime: record.correctedTime,
      remarks: record.remarks,
    })),
  );
  const createInitialEdits = (): PunchEdits =>
    Object.fromEntries(
      punchRecords.map((record) => [
        String(record.punchId),
        {
          correctedTime: record.correctedTime || record.originalTime || "",
          remarks: record.remarks ?? "",
        },
      ]),
    );
  const [editState, setEditState] = useState({
    signature: recordSignature,
    edits: createInitialEdits(),
  });
  const edits =
    editState.signature === recordSignature
      ? editState.edits
      : createInitialEdits();
  const setEdits = (update: SetStateAction<PunchEdits>) => {
    setEditState((previous) => {
      const current =
        previous.signature === recordSignature
          ? previous.edits
          : createInitialEdits();
      return {
        signature: recordSignature,
        edits:
          typeof update === "function" ? update(current) : update,
      };
    });
  };

  const [
    savingId,
    setSavingId,
  ] =
    useState<string | number | null>(
      null,
    );

  const [
    saveError,
    setSaveError,
  ] =
    useState<string | null>(
      null,
    );

  /* =======================================================
     UPDATE FIELD
     ======================================================= */

  const updateField = (
    punchId: string | number,
    field: keyof EditablePunch,
    value: string,
  ) => {
    setEdits(
      (previous) => ({
        ...previous,

        [String(punchId)]: {
          ...(previous[
            String(punchId)
          ] ?? {
            correctedTime: "",
            remarks: "",
          }),

          [field]: value,
        },
      }),
    );
  };

  /* =======================================================
     SAVE RECORD
     ======================================================= */

  const saveRecord = async (_punchId: string | number): Promise<void> => {
    // Saving an edit to an existing punch needs a server call that is not
    // wired up yet. Tell the user instead of pretending it was saved.
    setSavingId(null);
    setSaveError("Editing an existing punch is not available yet.");
  };

  return {
    edits,

    savingId,

    saveError,

    updateField,

    saveRecord,
  };
}