import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SalaryComponentType } from "./types/classificationTypes";

interface AdditionalClassificationForm {
  editingId: number | null;
  name: string;
  tag: string;
}

interface BranchForm {
  editingId: number | null;
  branchName: string;
  address: string;
  state: string;
  isActive: 0 | 1;
}

interface DesignationForm {
  editingId: number | null;
  designationName: string;
  page: number;
}

interface BankForm {
  editingId: number | null;
  bankName: string;
  acType: string;
  ifscCode: string;
}

interface SalaryComponentForm {
  editingId: number | null;
  componentName: string;
  printName: string;
  isCalculative: 0 | 1;
  isOpenComponent: 0 | 1;
  type: SalaryComponentType;
}

interface ClassificationState {
  additionalForm: AdditionalClassificationForm;
  branchForm: BranchForm;
  designationForm: DesignationForm;
  bankForm: BankForm;
  salaryComponentForm: SalaryComponentForm;
}

const initialState: ClassificationState = {
  additionalForm: { editingId: null, name: "", tag: "" },
  branchForm: { editingId: null, branchName: "", address: "", state: "", isActive: 1 },
  designationForm: { editingId: null, designationName: "", page: 1 },
  bankForm: { editingId: null, bankName: "", acType: "", ifscCode: "" },
  salaryComponentForm: {
    editingId: null,
    componentName: "",
    printName: "",
    isCalculative: 0,
    isOpenComponent: 0,
    type: "Earnings",
  },
};

const classificationSlice = createSlice({
  name: "classification",
  initialState,
  reducers: {
    // ---- Additional Classification ----
    setAdditionalField: (state, action: PayloadAction<{ field: "name" | "tag"; value: string }>) => {
      state.additionalForm[action.payload.field] = action.payload.value;
    },
    loadAdditionalForEdit: (state, action: PayloadAction<{ id: number; name: string; tag: string }>) => {
      state.additionalForm = { editingId: action.payload.id, name: action.payload.name, tag: action.payload.tag };
    },
    clearAdditionalForm: (state) => {
      state.additionalForm = initialState.additionalForm;
    },

    // ---- Branch ----
    setBranchField: (
      state,
      action: PayloadAction<{ field: "branchName" | "address" | "state"; value: string }>
    ) => {
      state.branchForm[action.payload.field] = action.payload.value;
    },
    setBranchActive: (state, action: PayloadAction<0 | 1>) => {
      state.branchForm.isActive = action.payload;
    },
    loadBranchForEdit: (state, action: PayloadAction<BranchForm>) => {
      state.branchForm = action.payload;
    },
    clearBranchForm: (state) => {
      state.branchForm = initialState.branchForm;
    },

    // ---- Designation ----
    setDesignationName: (state, action: PayloadAction<string>) => {
      state.designationForm.designationName = action.payload;
    },
    setDesignationPage: (state, action: PayloadAction<number>) => {
      state.designationForm.page = action.payload;
    },
    loadDesignationForEdit: (state, action: PayloadAction<{ id: number; designationName: string }>) => {
      state.designationForm.editingId = action.payload.id;
      state.designationForm.designationName = action.payload.designationName;
    },
    clearDesignationForm: (state) => {
      state.designationForm.editingId = null;
      state.designationForm.designationName = "";
    },

    // ---- Bank ----
    setBankField: (
      state,
      action: PayloadAction<{ field: "bankName" | "acType" | "ifscCode"; value: string }>
    ) => {
      state.bankForm[action.payload.field] = action.payload.value;
    },
    loadBankForEdit: (state, action: PayloadAction<BankForm>) => {
      state.bankForm = action.payload;
    },
    clearBankForm: (state) => {
      state.bankForm = initialState.bankForm;
    },

    // ---- Salary Component ----
    setSalaryComponentField: (
      state,
      action: PayloadAction<{ field: "componentName" | "printName"; value: string }>
    ) => {
      state.salaryComponentForm[action.payload.field] = action.payload.value;
    },
    setSalaryComponentCalculative: (state, action: PayloadAction<0 | 1>) => {
      state.salaryComponentForm.isCalculative = action.payload;
    },
    setSalaryComponentOpen: (state, action: PayloadAction<0 | 1>) => {
      state.salaryComponentForm.isOpenComponent = action.payload;
    },
    setSalaryComponentType: (state, action: PayloadAction<SalaryComponentType>) => {
      state.salaryComponentForm.type = action.payload;
    },
    loadSalaryComponentForEdit: (state, action: PayloadAction<SalaryComponentForm>) => {
      state.salaryComponentForm = action.payload;
    },
    clearSalaryComponentForm: (state, action: PayloadAction<SalaryComponentType | undefined>) => {
      state.salaryComponentForm = { ...initialState.salaryComponentForm, type: action.payload ?? "Earnings" };
    },
  },
});

export const {
  setAdditionalField, loadAdditionalForEdit, clearAdditionalForm,
  setBranchField, setBranchActive, loadBranchForEdit, clearBranchForm,
  setDesignationName, setDesignationPage, loadDesignationForEdit, clearDesignationForm,
  setBankField, loadBankForEdit, clearBankForm,
  setSalaryComponentField, setSalaryComponentCalculative, setSalaryComponentOpen,
  setSalaryComponentType, loadSalaryComponentForEdit, clearSalaryComponentForm,
} = classificationSlice.actions;

export default classificationSlice.reducer;
