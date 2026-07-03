import { useEffect } from "react";

import { useAppDispatch } from "@/hooks/useAppDispatch";

import {
  setEmployeeProfile,
} from "../../employeeSlice";

import {
  useGetProfileQuery,
  useGetHolidayListQuery,
} from "../api/dashboardApi";

export const useDashboard = () => {
  const dispatch = useAppDispatch();

  // Profile API

  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProfileQuery();

  // Holiday API

  const {
    data: holidayData,
    isLoading: holidayLoading,
    isError: holidayError,
  } = useGetHolidayListQuery();

  useEffect(() => {
    if (profileData?.data) {
      dispatch(
        setEmployeeProfile({
          companyName: profileData.data.CompanyName,

          fullName: profileData.data.FullName,

          shortName: profileData.data.ShortName,

          email:profileData.data.Email,

          employeeId: profileData.data.Code,

          designation:profileData.data.Designation,

          department: profileData.data.Department,
          
          lastLoginDateTime:profileData.data.LastLoginDateTime,
        })
      );
    }
  }, [profileData, dispatch]);

  return {
    profileData,
    holidayData,

    isLoading,
    holidayLoading,

    isError,
    holidayError,

    error,
    refetch,
  };
};