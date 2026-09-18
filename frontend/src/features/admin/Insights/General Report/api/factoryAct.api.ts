const API_BASE_URL = "/api";

/* =========================================================
   TYPES
========================================================= */

export interface FactoryActForm {
  id: string | number;
  name: string;
}

export interface FactoryActFormsResponse {
  data: FactoryActForm[];
}

/* =========================================================
   GET FACTORY ACT FORMS
========================================================= */

export const getFactoryActForms =
  async (): Promise<FactoryActForm[]> => {
    const response = await fetch(
      `${API_BASE_URL}/factory-act-forms`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Factory Act Forms: ${response.status}`,
      );
    }

    const result =
      (await response.json()) as
        | FactoryActForm[]
        | FactoryActFormsResponse;

    if (Array.isArray(result)) {
      return result;
    }

    return result.data ?? [];
  };

/* =========================================================
   GET SINGLE FACTORY ACT FORM
========================================================= */

export const getFactoryActFormById =
  async (
    id: string | number,
  ): Promise<FactoryActForm> => {
    const response = await fetch(
      `${API_BASE_URL}/factory-act-forms/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Factory Act Form: ${response.status}`,
      );
    }

    return (await response.json()) as FactoryActForm;
  };

/* =========================================================
   CREATE FACTORY ACT FORM
========================================================= */

export const createFactoryActForm =
  async (
    form: Omit<FactoryActForm, "id">,
  ): Promise<FactoryActForm> => {
    const response = await fetch(
      `${API_BASE_URL}/factory-act-forms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to create Factory Act Form: ${response.status}`,
      );
    }

    return (await response.json()) as FactoryActForm;
  };

/* =========================================================
   UPDATE FACTORY ACT FORM
========================================================= */

export const updateFactoryActForm =
  async (
    id: string | number,
    form: Omit<FactoryActForm, "id">,
  ): Promise<FactoryActForm> => {
    const response = await fetch(
      `${API_BASE_URL}/factory-act-forms/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update Factory Act Form: ${response.status}`,
      );
    }

    return (await response.json()) as FactoryActForm;
  };

/* =========================================================
   DELETE FACTORY ACT FORM
========================================================= */

export const deleteFactoryActForm =
  async (
    id: string | number,
  ): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/factory-act-forms/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to delete Factory Act Form: ${response.status}`,
      );
    }
  };