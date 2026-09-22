// import { useState, useCallback } from "react";
// import { EmployeeFormData } from "../types";

// const defaultFormData: EmployeeFormData = {
//   prefix: "",
//   employeeId: "344913",
//   title: "Ms",
//   firstName: "",
//   middleName: "",
//   lastName: "",
//   fullName: "",
//   gender: "Female",
//   fatherName: "",
//   maritalStatus: "Unmarried",
//   spouseName: "",
//   dateOfJoining: "",
//   dateOfSalary: "",
//   probationPeriod: 30,
//   panNumber: "",
//   aadhaarNumber: "",
//   uanNumber: "",
//   pfApplicable: true,
//   pfNumber: "",
//   esiApplicable: false,
//   esiNumber: "",
//   bankAccountNumber: "",
//   bankIfsc: "",
//   bankName: "",
//   photoUrl: "",
//   confirmationDate: "",
//   notes: "",
//   documents: [],
// };

// export const useEmployeeForm = (initialData?: Partial<EmployeeFormData>) => {
//   const [formData, setFormData] = useState<EmployeeFormData>({
//     ...defaultFormData,
//     ...initialData,
//   });

//   const handleChange = useCallback(
//     <K extends keyof EmployeeFormData>(field: K, value: EmployeeFormData[K]) => {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: value,
//       }));
//     },
//     []
//   );

//   const resetForm = useCallback((data?: Partial<EmployeeFormData>) => {
//     setFormData({
//       ...defaultFormData,
//       ...data,
//     });
//   }, []);

//   return {
//     formData,
//     setFormData,
//     handleChange,
//     resetForm,
//   };
// };












import { useState, useCallback } from "react";
import { EmployeeFormData } from "../types";

const defaultFormData: EmployeeFormData = {
  prefix: "",
  employeeId: "344913",
  title: "Ms",
  firstName: "",
  middleName: "",
  lastName: "",
  fullName: "",
  gender: "Female",
  fatherName: "",
  maritalStatus: "Unmarried",
  spouseName: "",
  dateOfJoining: "",
  dateOfSalary: "",
  probationPeriod: 30,
  panNumber: "",
  aadhaarNumber: "",
  uanNumber: "",
  pfApplicable: true,
  pfNumber: "",
  esiApplicable: false,
  esiNumber: "",
  bankAccountNumber: "",
  bankIfsc: "",
  bankName: "",
  photoUrl: "",
  confirmationDate: "",
  notes: "",
  documents: [],
};

export const useEmployeeForm = (initialData?: Partial<EmployeeFormData>) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const handleChange = useCallback(
    <K extends keyof EmployeeFormData>(field: K, value: EmployeeFormData[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const resetForm = useCallback((data?: Partial<EmployeeFormData>) => {
    setFormData({
      ...defaultFormData,
      ...data,
    });
  }, []);

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
  };
};