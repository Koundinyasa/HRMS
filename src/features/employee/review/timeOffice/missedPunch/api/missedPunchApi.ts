import type {
  MissedPunchEmployee,
  MissedPunchRequest,
  RawMissedPunchEmployee,
} from "../types/missedPunch.types";

import { baseApi } from "@/app/baseApi";

import {
  formatDateForApi,
} from "../validations/missedPunch.validation";
import { MISSED_PUNCH_API_BASE_URL } from "../constants/missedPunch.constants";

/* =========================================================
   API BASE URL
========================================================= */

/* =========================================================
   RESPONSE HANDLER
========================================================= */

async function handleResponse(
  response: Response,
): Promise<unknown> {
  const contentType =
    response.headers.get(
      "content-type",
    ) || "";

  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}`;

    try {
      if (
        contentType.includes(
          "application/json",
        )
      ) {
        const errorData =
          await response.json();

        if (
          typeof errorData?.message ===
          "string"
        ) {
          message =
            errorData.message;
        } else if (
          Array.isArray(
            errorData?.message,
          )
        ) {
          message =
            errorData.message.join(
              ", ",
            );
        }
      } else {
        const errorText =
          await response.text();

        if (errorText) {
          message = errorText;
        }
      }
    } catch {
      // Keep default message
    }

    throw new Error(message);
  }

  if (
    contentType.includes(
      "application/json",
    )
  ) {
    return response.json();
  }

  return response.text();
}

/* =========================================================
   GET VALUE FROM DIFFERENT BACKEND CASING
========================================================= */

function getValue(
  item: Record<string, unknown>,
  keys: string[],
): unknown {
  for (const key of keys) {
    if (
      item[key] !== undefined &&
      item[key] !== null
    ) {
      return item[key];
    }
  }

  return undefined;
}

/* =========================================================
   NORMALIZE EMPLOYEE
========================================================= */

function normalizeEmployee(
  item: RawMissedPunchEmployee,
): MissedPunchEmployee {
  const record =
    item as Record<
      string,
      unknown
    >;

  const employeeId =
    getValue(record, [
      "employeeId",
      "EmployeeId",
      "EmployeeID",
      "employeeID",
      "EmployeeCode",
      "Employee ID",
    ]);

  const employeeName =
    getValue(record, [
      "employeeName",
      "EmployeeName",
      "name",
      "Name",
      "Employee Name",
    ]);

  const punchDate =
    getValue(record, [
      "punchDate",
      "PunchDate",
      "Punch_Date",
      "date",
      "Date",
      "Punch Date",
    ]);

  const companyId =
    getValue(record, [
      "companyId",
      "CompanyId",
      "CompanyID",
    ]);

  const department =
    getValue(record, [
      "department",
      "Department",
    ]);

  const designation =
    getValue(record, [
      "designation",
      "Designation",
    ]);

  return {
    ...record,

    employeeId:
      String(
        employeeId ?? "",
      ).trim(),

    employeeName:
      String(
        employeeName ?? "",
      ),

    punchDate:
      String(
        punchDate ?? "",
      ),

    companyId:
      typeof companyId === "string" ||
      typeof companyId === "number"
        ? companyId
        : null,

    department:
      department
        ? String(department)
        : null,

    designation:
      designation
        ? String(designation)
        : null,
  };
}

/* =========================================================
   EXTRACT ARRAY FROM RESPONSE
========================================================= */

function extractEmployees(
  result: unknown,
): unknown[] {
  if (Array.isArray(result)) {
    return result;
  }

  if (
    result &&
    typeof result === "object"
  ) {
    const response =
      result as Record<
        string,
        unknown
      >;

    if (
      Array.isArray(
        response.data,
      )
    ) {
      return response.data;
    }

    if (
      Array.isArray(
        response.result,
      )
    ) {
      return response.result;
    }

    if (
      Array.isArray(
        response.results,
      )
    ) {
      return response.results;
    }

    if (
      Array.isArray(
        response.employees,
      )
    ) {
      return response.employees;
    }

    if (
      Array.isArray(
        response.data &&
          typeof response.data ===
            "object"
          ? (
              response.data as Record<
                string,
                unknown
              >
            ).employees
          : undefined,
      )
    ) {
      return (
        (
          response.data as Record<
            string,
            unknown
          >
        ).employees as unknown[]
      );
    }
  }

  return [];
}

/* =========================================================
   MISSED PUNCH EMPLOYEES
   BACKEND:
   POST /api/review/missedpunchemployees
========================================================= */

export async function getMissedPunchEmployees(
  params: MissedPunchRequest,
): Promise<MissedPunchEmployee[]> {
  const url =
    `${MISSED_PUNCH_API_BASE_URL}/review/missedpunchemployees`;

  const body: Record<
    string,
    unknown
  > = {
    fromDate:
      formatDateForApi(
        params.fromDate,
      ),

    toDate:
      formatDateForApi(
        params.toDate,
      ),
  };

  console.log(
    "====================================",
  );

  console.log(
    "[Missed Punch] URL:",
    url,
  );

  console.log(
    "[Missed Punch] Method:",
    "POST",
  );

  console.log(
    "[Missed Punch] Body:",
    body,
  );

  console.log(
    "====================================",
  );

  const response =
    await fetch(url, {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify(body),
    });

  const result =
    await handleResponse(
      response,
    );

  console.log(
    "[Missed Punch] Raw Response:",
    result,
  );

  const employees =
    extractEmployees(
      result,
    );

  return employees.map(
    (item) =>
      normalizeEmployee(
        item as RawMissedPunchEmployee,
      ),
  );
}

export const missedPunchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMissedPunchEmployees: builder.query<
      MissedPunchEmployee[],
      MissedPunchRequest
    >({
      query: ({ fromDate, toDate }) => ({
        url: "/review/missedpunchemployees",
        method: "POST",
        body: {
          fromDate: formatDateForApi(fromDate),
          toDate: formatDateForApi(toDate),
        },
      }),
      transformResponse: (result: unknown) =>
        extractEmployees(result).map((item) =>
          normalizeEmployee(item as RawMissedPunchEmployee),
        ),
      providesTags: [{ type: "Punch", id: "MISSED_PUNCH" }],
    }),
  }),
});

export const {
  useGetMissedPunchEmployeesQuery,
} = missedPunchApi;