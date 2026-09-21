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


import {
  useEffect,
  useState,
} from "react";

import type {
  EditablePunch,
  PunchEdits,
  PunchRecord,
  UsePunchEditorResult,
} from "../types/punch.types";

export function usePunchEditor(
  punchRecords: PunchRecord[],
): UsePunchEditorResult {
  const [
    edits,
    setEdits,
  ] =
    useState<PunchEdits>({});

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
     INITIALIZE EDIT VALUES
     ======================================================= */

  useEffect(() => {
    /*
     * If there are no punch records,
     * simply clear edits.
     */
    if (
      !punchRecords ||
      punchRecords.length === 0
    ) {
      setEdits({});
      return;
    }

    const initial: PunchEdits =
      {};

    punchRecords.forEach(
      (record) => {
        const id =
          String(
            record.punchId,
          );

        initial[id] = {
          correctedTime:
            record.correctedTime ||
            record.originalTime ||
            "",

          remarks:
            record.remarks ?? "",
        };
      },
    );

    setEdits(initial);
  }, [
    /*
     * IMPORTANT:
     *
     * We depend on the contents rather than
     * blindly depending on a newly-created
     * empty array.
     */
    JSON.stringify(
      punchRecords.map(
        (record) => ({
          punchId:
            record.punchId,

          originalTime:
            record.originalTime,

          correctedTime:
            record.correctedTime,

          remarks:
            record.remarks,
        }),
      ),
    ),
  ]);

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

  const saveRecord = async (
    punchId: string | number,
  ): Promise<void> => {
    setSavingId(punchId);
    setSaveError(null);

    try {
      const edit =
        edits[
          String(punchId)
        ];

      if (!edit) {
        throw new Error(
          "Punch record not found.",
        );
      }

      /*
       * Your backend currently provides
       * GET punch APIs only.
       *
       * Do not call a fake update endpoint.
       */

      console.log(
        "[Punch] Update prepared:",
        {
          punchId,

          correctedTime:
            edit.correctedTime,

          remarks:
            edit.remarks,
        },
      );

      /*
       * Temporary success.
       *
       * Add the real POST/PUT endpoint here
       * after the backend update API is provided.
       */
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update punch.";

      setSaveError(message);

      throw err;
    } finally {
      setSavingId(null);
    }
  };

  return {
    edits,

    savingId,

    saveError,

    updateField,

    saveRecord,
  };
}