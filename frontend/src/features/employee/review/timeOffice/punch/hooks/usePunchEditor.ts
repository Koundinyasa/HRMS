// // import {
// //   useEffect,
// //   useState,
// // } from "react";

// // import type {
// //   EditablePunch,
// //   PunchEdits,
// //   PunchRecord,
// //   UsePunchEditorResult,
// // } from "../types/punch.types";

// // export function usePunchEditor(
// //   punchRecords: PunchRecord[],
// // ): UsePunchEditorResult {
// //   const [edits, setEdits] =
// //     useState<PunchEdits>({});

// //   const [savingId, setSavingId] =
// //     useState<string | number | null>(
// //       null,
// //     );

// //   const [saveError, setSaveError] =
// //     useState<string | null>(null);

// //   useEffect(() => {
// //     const initial: PunchEdits = {};

// //     punchRecords.forEach(
// //       (record) => {
// //         initial[
// //           String(record.punchId)
// //         ] = {
// //           correctedTime:
// //             record.correctedTime ||
// //             record.originalTime ||
// //             "",

// //           remarks:
// //             record.remarks ?? "",
// //         };
// //       },
// //     );

// //     setEdits(initial);
// //   }, [punchRecords]);

// //   const updateField = (
// //     punchId: string | number,
// //     field: keyof EditablePunch,
// //     value: string,
// //   ) => {
// //     setEdits((previous) => ({
// //       ...previous,

// //       [String(punchId)]: {
// //         ...previous[String(punchId)],

// //         [field]: value,
// //       },
// //     }));
// //   };

// //   /*
// //    * Your current backend code only exposes
// //    * GET punch endpoints.
// //    *
// //    * Therefore this hook prepares the edited
// //    * values but does NOT call a non-existing
// //    * POST endpoint.
// //    */
// //   const saveRecord = async (
// //     punchId: string | number,
// //   ): Promise<void> => {
// //     setSavingId(punchId);
// //     setSaveError(null);

// //     try {
// //       const edit =
// //         edits[String(punchId)];

// //       if (!edit) {
// //         throw new Error(
// //           "Punch record not found.",
// //         );
// //       }

// //       /*
// //        * When your backend update API is available,
// //        * put the POST/PUT request here.
// //        *
// //        * No fake API endpoint is used.
// //        */

// //       console.log(
// //         "Punch update prepared:",
// //         {
// //           punchId,
// //           ...edit,
// //         },
// //       );
// //     } catch (err) {
// //       setSaveError(
// //         err instanceof Error
// //           ? err.message
// //           : "Failed to update punch.",
// //       );

// //       throw err;
// //     } finally {
// //       setSavingId(null);
// //     }
// //   };

// //   return {
// //     edits,
// //     savingId,
// //     saveError,
// //     updateField,
// //     saveRecord,
// //   };
// // }

// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import type {
//   EditablePunch,
//   PunchEdits,
//   PunchRecord,
//   UsePunchEditorResult,
// } from "../types/punch.types";

// export function usePunchEditor(
//   punchRecords: PunchRecord[],
// ): UsePunchEditorResult {
//   const [edits, setEdits] =
//     useState<PunchEdits>({});

//   const [savingId, setSavingId] =
//     useState<string | number | null>(null);

//   const [saveError, setSaveError] =
//     useState<string | null>(null);

//   /*
//    * Create a stable value from the actual punch
//    * data instead of using the punchRecords array
//    * itself as the useEffect dependency.
//    *
//    * This prevents:
//    *
//    * render
//    *   ↓
//    * useEffect
//    *   ↓
//    * setEdits
//    *   ↓
//    * render
//    *   ↓
//    * useEffect
//    *   ↓
//    * infinite loop
//    */
//   const punchRecordsKey = useMemo(() => {
//     return punchRecords
//       .map((record) =>
//         [
//           String(record.punchId),
//           record.correctedTime ?? "",
//           record.originalTime ?? "",
//           record.remarks ?? "",
//         ].join("|"),
//       )
//       .join("||");
//   }, [punchRecords]);

//   useEffect(() => {
//     const initial: PunchEdits = {};

//     punchRecords.forEach((record) => {
//       initial[String(record.punchId)] = {
//         correctedTime:
//           record.correctedTime ||
//           record.originalTime ||
//           "",

//         remarks:
//           record.remarks ?? "",
//       };
//     });

//     setEdits((previous) => {
//       /*
//        * If there are no records, only clear the
//        * state when it actually contains something.
//        */
//       if (
//         punchRecords.length === 0 &&
//         Object.keys(previous).length === 0
//       ) {
//         return previous;
//       }

//       /*
//        * Don't update state if the values are
//        * already exactly the same.
//        */
//       const previousKeys =
//         Object.keys(previous);

//       const initialKeys =
//         Object.keys(initial);

//       if (
//         previousKeys.length ===
//           initialKeys.length &&
//         initialKeys.every((key) => {
//           return (
//             previous[key]?.correctedTime ===
//               initial[key]?.correctedTime &&
//             previous[key]?.remarks ===
//               initial[key]?.remarks
//           );
//         })
//       ) {
//         return previous;
//       }

//       return initial;
//     });
//   }, [punchRecordsKey]);

//   const updateField = (
//     punchId: string | number,
//     field: keyof EditablePunch,
//     value: string,
//   ) => {
//     setEdits((previous) => ({
//       ...previous,

//       [String(punchId)]: {
//         ...(previous[String(punchId)] ?? {
//           correctedTime: "",
//           remarks: "",
//         }),

//         [field]: value,
//       },
//     }));
//   };

//   /*
//    * Backend currently exposes GET punch APIs.
//    *
//    * No fake POST/PUT endpoint is called here.
//    */
//   const saveRecord = async (
//     punchId: string | number,
//   ): Promise<void> => {
//     setSavingId(punchId);
//     setSaveError(null);

//     try {
//       const edit =
//         edits[String(punchId)];

//       if (!edit) {
//         throw new Error(
//           "Punch record not found.",
//         );
//       }

//       /*
//        * Update API is not currently added because
//        * only GET punch endpoints were provided.
//        *
//        * This keeps the existing backend unchanged.
//        */
//       console.log(
//         "Punch update prepared:",
//         {
//           punchId,
//           correctedTime:
//             edit.correctedTime,
//           remarks: edit.remarks,
//         },
//       );
//     } catch (err) {
//       const message =
//         err instanceof Error
//           ? err.message
//           : "Failed to update punch.";

//       setSaveError(message);

//       throw err;
//     } finally {
//       setSavingId(null);
//     }
//   };

//   return {
//     edits,
//     savingId,
//     saveError,
//     updateField,
//     saveRecord,
//   };
// }


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