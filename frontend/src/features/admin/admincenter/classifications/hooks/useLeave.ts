import { useMemo } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setSelectedEmployeeId, selectSelectedEmployeeId } from '../leaveSlice';
import {
    useGetLeaveEmployeesQuery,
    useGetLeaveTypesQuery,
    useGetLeaveBalanceQuery,
    useGetLeaveSummaryQuery,
    useGetLeaveHistoryQuery,
    useApplyLeaveAsHrMutation,
} from '../api/leaveApi';
import type { LeaveBalance } from '../types/leave.types';

export const useLeave = () => {
    const dispatch = useAppDispatch();

    // Only decides who `applyhr` targets — balance/summary/history are JWT-scoped
    // to the logged-in user and ignore this.
    const selectedEmployeeId = useAppSelector(selectSelectedEmployeeId);

    const employees = useGetLeaveEmployeesQuery();
    const leaveTypes = useGetLeaveTypesQuery();
    const balance = useGetLeaveBalanceQuery();
    const summary = useGetLeaveSummaryQuery();
    const history = useGetLeaveHistoryQuery();

    const [applyLeaveAsHr, applyLeaveAsHrState] = useApplyLeaveAsHrMutation();

    // USP_EmployeeLeaveBalance returns leaveTypeId but no code, so pair it with
    // leavetypes to label the rail (same join the chatbot does).
    const balances = useMemo<LeaveBalance[]>(() => {
        const types = leaveTypes.data ?? [];
        return (balance.data ?? []).map((b) => ({
            leaveTypeId: b.leaveTypeId,
            code: types.find((t) => t.leaveTypeId === b.leaveTypeId)?.code ?? `#${b.leaveTypeId}`,
            balance: b.closingBalance,
        }));
    }, [leaveTypes.data, balance.data]);

    const selectedEmployee = employees.data?.find((e) => e.employeeId === selectedEmployeeId);

    return {
        employees,
        selectedEmployee,
        selectedEmployeeId,
        selectEmployee: (id: string | null) => dispatch(setSelectedEmployeeId(id)),

        leaveTypes,
        balance,
        balances,
        summary,
        history,

        applyLeaveAsHr,
        applyLeaveAsHrState,
    };
};
