import { useGetLwfDetailsQuery, useUpdateLwfDetailsMutation } from "../api/companyApi";
import type {LwfConfiguration} from "../types/company.types"


const MONTHS=['january','february','march','april','may','june','july','august','september','october','november','december'] as const;


const MONTH_LABELS: Record<(typeof MONTHS)[number], string> = {
  january: "January", february: "February", march: "March", april: "April",
  may: "May", june: "June", july: "July", august: "August",
  september: "September", october: "October", november: "November", december: "December",
};


export function monthsToArray(config: LwfConfiguration): string[] {
  return MONTHS.filter((m) => config[m]).map((m) => MONTH_LABELS[m]);
}

export function arrayToMonths(
  base: Omit<LwfConfiguration, (typeof MONTHS)[number]>,
  selectedMonths: string[],
): LwfConfiguration {
  const monthFlags = MONTHS.reduce((acc, m) => {
    acc[m] = selectedMonths.includes(MONTH_LABELS[m]);
    return acc;
  }, {} as Record<(typeof MONTHS)[number], boolean>);

  return { ...base, ...monthFlags } as LwfConfiguration;
}

export const useLwfDetails =()=>{
    const {data,isLoading,isFetching,isError,refetch}=useGetLwfDetailsQuery();
    const [updateLwf,{isLoading:isSaving}]=useUpdateLwfDetailsMutation();

    return {
        lwf: data?.configuration?.[0],
        lwfGroups: data?.group,
        isLoading,
        isFetching,
        isError,
        refetch,
        updateLwf,
        isSaving
    }
}