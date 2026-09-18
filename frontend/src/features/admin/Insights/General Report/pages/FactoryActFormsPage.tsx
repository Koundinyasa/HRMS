// import { useEffect, useState } from "react";

// type FactoryActForm = {
//   id: string | number;
//   name: string;
// };

// type FactoryActResponse =
//   | FactoryActForm[]
//   | {
//       data?: FactoryActForm[];
//       items?: FactoryActForm[];
//       results?: FactoryActForm[];
//     };

// const FACTORY_ACT_FORMS_API =
//   "/api/factory-act-forms";

// function getForms(
//   response: FactoryActResponse,
// ): FactoryActForm[] {
//   if (Array.isArray(response)) {
//     return response;
//   }

//   if (Array.isArray(response.data)) {
//     return response.data;
//   }

//   if (Array.isArray(response.items)) {
//     return response.items;
//   }

//   if (Array.isArray(response.results)) {
//     return response.results;
//   }

//   return [];
// }

// export default function FactoryActFormsPage() {
//   const [forms, setForms] =
//     useState<FactoryActForm[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState<string | null>(null);

//   useEffect(() => {
//     let cancelled = false;

//     const loadForms = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch(
//           FACTORY_ACT_FORMS_API,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type":
//                 "application/json",
//             },
//           },
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Failed to load Factory Act Forms (${response.status})`,
//           );
//         }

//         const result =
//           (await response.json()) as FactoryActResponse;

//         if (!cancelled) {
//           setForms(getForms(result));
//         }
//       } catch (err) {
//         if (!cancelled) {
//           setError(
//             err instanceof Error
//               ? err.message
//               : "Unable to load Factory Act Forms.",
//           );
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     };

//     void loadForms();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   return (
//     <section
//       className="
//         w-full
//         bg-[#f5f6f8]
//       "
//     >
//       {loading && (
//         <div
//           className="
//             min-h-[52px]
//             w-full
//             rounded-[4px]
//             bg-[#e5eaf2]
//             px-6
//             py-3
//             text-[20px]
//             font-medium
//             text-[#172033]
//           "
//         >
//           Loading...
//         </div>
//       )}

//       {!loading && error && (
//         <div
//           className="
//             min-h-[52px]
//             w-full
//             rounded-[4px]
//             bg-[#e5eaf2]
//             px-6
//             py-3
//             text-[16px]
//             font-medium
//             text-[#b42318]
//           "
//         >
//           {error}
//         </div>
//       )}

//       {!loading &&
//         !error &&
//         forms.map((form) => (
//           <button
//             key={form.id}
//             type="button"
//             className="
//               flex
//               min-h-[52px]
//               w-full
//               max-w-[592px]
//               items-center
//               rounded-[4px]
//               bg-[#e5eaf2]
//               px-6
//               text-left
//               text-[20px]
//               font-medium
//               text-[#172033]
//               transition
//               hover:bg-[#dce3ee]
//             "
//           >
//             {form.name}
//           </button>
//         ))}

//       {!loading &&
//         !error &&
//         forms.length === 0 && (
//           <div
//             className="
//               min-h-[52px]
//               w-full
//               rounded-[4px]
//               bg-[#e5eaf2]
//               px-6
//               py-3
//               text-[16px]
//               text-[#5f6368]
//             "
//           >
//             No Factory Act Forms available.
//           </div>
//         )}
//     </section>
//   );
// }


import { useEffect, useState } from "react";

type FactoryActForm = {
  id: string | number;
  name: string;
};

type FactoryActResponse =
  | FactoryActForm[]
  | {
      data?: FactoryActForm[];
      items?: FactoryActForm[];
      results?: FactoryActForm[];
    };

const FACTORY_ACT_FORMS_API =
  "/api/factory-act-forms";

function getForms(
  response: FactoryActResponse,
): FactoryActForm[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }

  if (Array.isArray(response.results)) {
    return response.results;
  }

  return [];
}

export default function FactoryActFormsPage() {
  const [forms, setForms] =
    useState<FactoryActForm[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadForms = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          FACTORY_ACT_FORMS_API,
          {
            method: "GET",
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load Factory Act Forms (${response.status})`,
          );
        }

        const result =
          (await response.json()) as FactoryActResponse;

        if (!cancelled) {
          setForms(getForms(result));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load Factory Act Forms.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadForms();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="
        w-full
        bg-[#f5f6f8]
      "
    >
      {loading && (
        <div
          className="
            min-h-[52px]
            w-full
            rounded-[4px]
            bg-[#e5eaf2]
            px-6
            py-3
            text-[20px]
            font-medium
            text-[#172033]
          "
        >
          Loading...
        </div>
      )}

      {!loading &&
        forms.map((form) => (
          <button
            key={form.id}
            type="button"
            className="
              flex
              min-h-[52px]
              w-full
              max-w-[592px]
              items-center
              rounded-[4px]
              bg-[#e5eaf2]
              px-6
              text-left
              text-[20px]
              font-medium
              text-[#172033]
              transition
              hover:bg-[#dce3ee]
            "
          >
            {form.name}
          </button>
        ))}

      {!loading &&
        forms.length === 0 && (
          <div
            className="
              min-h-[52px]
              w-full
              rounded-[4px]
              bg-[#e5eaf2]
              px-6
              py-3
              text-[16px]
              text-[#5f6368]
            "
          >
            No Factory Act Forms available.
          </div>
        )}
    </section>
  );
}
