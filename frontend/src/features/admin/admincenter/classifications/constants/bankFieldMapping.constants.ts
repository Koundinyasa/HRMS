import type { BankFieldConfigResponse } from "../types/classificationTypes";

// Placeholder shown until GET /classifications/banks/:id/field-mapping exists on the
// backend. See useBankFieldMapping.ts — only used when the real query errors.
export const DEFAULT_BANK_FIELD_CONFIG: BankFieldConfigResponse = {
  BankId: 0,
  QuickTokens: [
    { Label: "Month Year", Token: "monthyear" },
    { Label: "Month", Token: "monthname" },
    { Label: "Year", Token: "year" },
    { Label: "Month", Token: "MM" },
    { Label: "Year", Token: "YY" },
    { Label: "Employee Name", Token: "empname" },
    { Label: "Total Amount", Token: "total_net_amount" },
  ],
  AvailableFields: [
    { FieldId: "neft", Label: "NEFT", IsEnabled: true, IconKey: "hash" },
    { FieldId: "account-no", Label: "Account No.", IsEnabled: true, IconKey: "credit-card" },
    { FieldId: "amount", Label: "Amount", IsEnabled: true, IconKey: "dollar" },
    { FieldId: "employee-name", Label: "Employee Name", IsEnabled: true, IconKey: "user" },
    { FieldId: "employee-ref-no", Label: "Employee Ref No", IsEnabled: true, IconKey: "info" },
    { FieldId: "remarks", Label: "Remarks", IsEnabled: true, IconKey: "message" },
    { FieldId: "date", Label: "Date", IsEnabled: true, IconKey: "calendar" },
    { FieldId: "ifsc-code", Label: "IFSC Code", IsEnabled: true, IconKey: "code" },
    { FieldId: "bank-name", Label: "Bank Name", IsEnabled: true, IconKey: "bank" },
    { FieldId: "email-id", Label: "Email ID", IsEnabled: true, IconKey: "mail" },
    { FieldId: "credit-debit", Label: "Credit/Debit", IsEnabled: false, IconKey: "swap" },
    { FieldId: "account-type", Label: "Account Type", IsEnabled: false, IconKey: "help" },
    { FieldId: "narration", Label: "Narration", IsEnabled: false, IconKey: "file" },
    { FieldId: "transaction-type", Label: "Transaction Type", IsEnabled: false, IconKey: "shuffle" },
    { FieldId: "current-code", Label: "Current Code", IsEnabled: false, IconKey: "code" },
    { FieldId: "branch-id", Label: "Branch ID", IsEnabled: false, IconKey: "fingerprint" },
    { FieldId: "sl-no", Label: "Sl No", IsEnabled: false, IconKey: "hash" },
    { FieldId: "classification", Label: "Classification", IsEnabled: false, IconKey: "folder", IsAppendType: true },
    { FieldId: "additional-classification", Label: "Additional Cla...", IsEnabled: false, IconKey: "folder-plus", IsAppendType: true },
  ],
  MappingRows: [
    { RowId: "neft", HeaderFieldName: "NEFT", CharacterLength: "", Prefix: "N", Suffix: "", Pattern: "", Concat: false, ExpressionNotApplicable: true },
    { RowId: "account-no", HeaderFieldName: "Account No.", CharacterLength: "", Prefix: "", Suffix: "", Pattern: "", Concat: false },
    { RowId: "amount", HeaderFieldName: "Amount", CharacterLength: "", Prefix: "", Suffix: "", Pattern: "", Concat: false },
    { RowId: "employee-name", HeaderFieldName: "Employee Name", CharacterLength: "", Prefix: "", Suffix: "", Pattern: "", Concat: false },
    { RowId: "employee-ref-no", HeaderFieldName: "Employee Ref No", CharacterLength: "", Prefix: "", Suffix: "", Pattern: "", Concat: false },
  ],
};
