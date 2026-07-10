import { useEffect } from "react";

import { useAppDispatch } from "@/hooks/useAppDispatch";

import {
  setEmployeeProfile,
} from "../../employeeSlice";

import {
  useGetProfileQuery,
  useGetHolidayListQuery,
  useGetMenusQuery,
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

  //Menu API
  const {
    data: menuData,
    isLoading: menuLoading,
    isError: menuError,
  } = useGetMenusQuery();

  useEffect(() => {
    if (profileData?.data) {
      dispatch(
        setEmployeeProfile({
          companyName: profileData.data.profile.CompanyName,

          fullName: profileData.data.profile.FullName,

          shortName: profileData.data.profile.ShortName,

          email: profileData.data.profile.Email,

          employeeId: profileData.data.profile.Code,

          designation: profileData.data.profile.Designation,

          department: profileData.data.profile.Department,

          lastLoginDateTime: profileData.data.profile.LastLoginDateTime,
        })
      );
    }
  }, [profileData, dispatch]);

  return {
    profileData,
    holidayData,
    menuData,

    isLoading,
    holidayLoading,
    menuLoading,

    isError,
    holidayError,
    menuError,

    error,
    refetch,
  };
};