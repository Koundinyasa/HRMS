import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
    setActiveTab,
    setSelectedEmployeeIds,
    toggleSelectedEmployeeId,
    clearSelectedEmployeeIds,
    setFilters,
    resetFilters,
    setSelectedStatutories,
    setApplicable,
    setClassificationField,
    setClassificationMonth,
    selectBulkUpdateActiveTab,
    selectBulkUpdateSelectedEmployeeIds,
    selectBulkUpdateFilters,
    selectBulkUpdateSelectedStatutories,
    selectBulkUpdateApplicable,
    selectBulkUpdateClassificationField,
    selectBulkUpdateClassificationMonth,
} from '../bulkUpdateSlice';
import {
    useGetStatutoryEmployeesQuery,
    useUpdateStatutoryBulkMutation,
    useGetClassificationEmployeesQuery,
    useUpdateClassificationBulkMutation,
} from '../api/bulkUpdateApi';
import type { BulkUpdateTab, BulkUpdateFilters } from '../types/bulkUpdate.types';

export const useBulkUpdate = () => {
    const dispatch = useAppDispatch();

    const activeTab = useAppSelector(selectBulkUpdateActiveTab);
    const selectedEmployeeIds = useAppSelector(selectBulkUpdateSelectedEmployeeIds);
    const filters = useAppSelector(selectBulkUpdateFilters);
    const selectedStatutories = useAppSelector(selectBulkUpdateSelectedStatutories);
    const applicable = useAppSelector(selectBulkUpdateApplicable);
    const classificationField = useAppSelector(selectBulkUpdateClassificationField);
    const classificationMonth = useAppSelector(selectBulkUpdateClassificationMonth);

    const changeTab = (tab: BulkUpdateTab) => dispatch(setActiveTab(tab));
    const selectEmployeeIds = (ids: string[]) => dispatch(setSelectedEmployeeIds(ids));
    const toggleEmployeeId = (id: string) => dispatch(toggleSelectedEmployeeId(id));
    const clearSelection = () => dispatch(clearSelectedEmployeeIds());
    const updateFilters = (next: BulkUpdateFilters) => dispatch(setFilters(next));
    const clearFilters = () => dispatch(resetFilters());
    const updateSelectedStatutories = (values: string[]) => dispatch(setSelectedStatutories(values));
    const updateApplicable = (value: boolean | null) => dispatch(setApplicable(value));
    const updateClassificationField = (value: string) => dispatch(setClassificationField(value));
    const updateClassificationMonth = (value: string) => dispatch(setClassificationMonth(value));

    // NOTE: these hooks only type-check correctly once `baseApi.ts` has a
    // real `fetchBaseQuery(...)` — see app/baseApi.ts.
    const statutoryEmployees = useGetStatutoryEmployeesQuery(filters);
    const [updateStatutoryBulk, updateStatutoryBulkState] = useUpdateStatutoryBulkMutation();

    const classificationEmployees = useGetClassificationEmployeesQuery(filters);
    const [updateClassificationBulk, updateClassificationBulkState] = useUpdateClassificationBulkMutation();

    return {
        activeTab,
        selectedEmployeeIds,
        filters,
        selectedStatutories,
        applicable,
        classificationField,
        classificationMonth,

        changeTab,
        selectEmployeeIds,
        toggleEmployeeId,
        clearSelection,
        updateFilters,
        clearFilters,
        updateSelectedStatutories,
        updateApplicable,
        updateClassificationField,
        updateClassificationMonth,

        statutoryEmployees,
        updateStatutoryBulk,
        updateStatutoryBulkState,

        classificationEmployees,
        updateClassificationBulk,
        updateClassificationBulkState,
    };
};