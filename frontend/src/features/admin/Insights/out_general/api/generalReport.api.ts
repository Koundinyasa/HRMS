const API_BASE_URL = "/api";


// GET GENERAL REPORT FIELDS
export const getGeneralReportFields = async () => {
  const response = await fetch(
    `${API_BASE_URL}/general-report/fields`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch General Report fields"
    );
  }

  return response.json();
};


// GET ALL GENERAL REPORTS
export const getGeneralReports = async () => {
  const response = await fetch(
    `${API_BASE_URL}/general-report`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch General Reports"
    );
  }

  return response.json();
};


// GET PINNED REPORTS
export const getPinnedReports = async () => {
  const response = await fetch(
    `${API_BASE_URL}/general-report/pinned`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch pinned reports"
    );
  }

  return response.json();
};


// CREATE GENERAL REPORT
export const saveGeneralReport = async (
  reportData: Record<string, unknown>
) => {
  const response = await fetch(
    `${API_BASE_URL}/general-report`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to save General Report"
    );
  }

  return response.json();
};


// UPDATE GENERAL REPORT
export const updateGeneralReport = async (
  reportId: string,
  reportData: Record<string, unknown>
) => {
  const response = await fetch(
    `${API_BASE_URL}/general-report/${reportId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update General Report"
    );
  }

  return response.json();
};


// DELETE GENERAL REPORT
export const deleteGeneralReport = async (
  reportId: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/general-report/${reportId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete General Report"
    );
  }

  return response.json();
};