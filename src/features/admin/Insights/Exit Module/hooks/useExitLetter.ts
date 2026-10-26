import { useState } from "react";

import {
  useGetRelievingLetterEmployeeQuery,
  useGetExperienceLetterEmployeeQuery,
} from "../api/exitReportsApi";

export const useExitLetter = () => {
  const [employeeId, setEmployeeId] = useState("");

  const relievingLetter = useGetRelievingLetterEmployeeQuery(
    employeeId,
    {
      skip: !employeeId,
    }
  );

  const experienceLetter = useGetExperienceLetterEmployeeQuery(
    employeeId,
    {
      skip: !employeeId,
    }
  );

  const searchEmployee = () => {
    if (!employeeId.trim()) {
      return;
    }

    relievingLetter.refetch();
    experienceLetter.refetch();
  };

  return {
    employeeId,
    setEmployeeId,
    searchEmployee,
    relievingEmployee: relievingLetter.data,
    experienceEmployee: experienceLetter.data,
    isLoading:
      relievingLetter.isLoading ||
      experienceLetter.isLoading,
  };
};