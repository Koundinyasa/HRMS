export interface CreateLeaveAdjustment {
    employeeId:number;
    adjustmentType:String;
    leaveBalance:number;
    numberOfDays:number;
}

export interface ImportLeaveAdjustment {
    templateTypeId:number;
    payMonthId:number;
}

export interface ManualAllotmentEmployee {
    employeeId:number;
    allotment:number;
}

export interface UpdateManualAllotment {
    policyId:number;
    leaveId:number;
    employees:ManualAllotmentEmployee[];
}

export interface ApplyLeave {
    employeeId:number;
    dates:String;
    leaveType:String;
}

export interface ImportDaily {
    templateType:String;
    policyId:number;
    month:string;
}

export interface Reprocess {
    policyId:number;
    month:String;
}

export interface SaveLeaveForm {
    employeeId:number;
    date:String;
    firstHalf:String;
    secondHalf:String;
    remarks:String;
}

export interface ApproveRejectLeave {
    leaveIds:number;
}

export interface CreateHoliday {
    holidayName:String;
    holidayDate:String;
    nationalHoliday:boolean;
    restrictedHoliday:boolean;
}

export interface UpdateLeavePolicySettings {
    effectiveFrom:String;
    active:boolean;
    hideInESS:boolean;
}