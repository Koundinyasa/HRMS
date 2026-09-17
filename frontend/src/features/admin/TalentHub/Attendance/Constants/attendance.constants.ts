export const Configurations_Details_Tab = [
    { label: 'Force Approval', path: 'forceapproval' },
];

export const Integrations_Details_Tab = [
    { label: 'Settings', path: 'settings' },
    { label: 'Attendance Integrations', path: 'attendanceintegrations' },
    { label: 'Reconcile Leave', path: 'reconcileleave', children: [
        { label: "Missing Leave", path: "missingleave" },
        { label: "Penalty Leave Deduction", path: "penaltyleavededuction" },
        { label: "Leave/Punch Exist", path: "leavepunchexit" }
    ] },
];