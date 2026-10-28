// ======================================================
// DEPARTMENT
// ======================================================
export interface Department {
  ID: number;
  DepartmentName: string;
  Code: string;
}

// ======================================================
// CATEGORY
// ======================================================

export interface Category {
  ID: number;
  CategoryName: string;
}

// ======================================================
// SUB CATEGORY
// ======================================================

export interface SubCategory {
  ID: number;
  SubCategoryName: string;
}

// ======================================================
// RAISE TICKET REQUEST
// ======================================================

export interface RaiseTicketRequest {
  departmentId: number;
  categoryId: number;
  subCategoryId: number;
  assetNumber?: string;
  location: string;
  contactNo: string;
  subject: string;
  description: string;
}

// ======================================================
// RAISE TICKET RESPONSE
// ======================================================

export interface RaiseTicketResponse {
  StatusCode?: number;
  Message?: string;
  TicketID?: number;
}



// ======================================================
// MY TICKET
// ======================================================

export interface TicketItem {
  ID: number;

  TicketNumber: string;

  Subject: string;

  Description: string;

  Department: string;

  Category: string;

  SubCategory: string;

  Priority: string;

  Status: string;

  AssignedToEmployeeID: string;

  AssignedTo: string;

  CreatedDateTime: string;

  ModifiedDateTime: string | null;

  ResolvedDateTime: string | null;

  ClosedDateTime: string | null;

  ClosureRemarks: string | null;

  // Latest ticket action/message information
  MessageType: string | null;

  // Request/message from support team
  Remarks: string | null;

  RemarksDateTime: string | null;
}

// ======================================================
// MY TICKETS RESPONSE
// ======================================================

export type MyTicketsResponse = TicketItem[];

// ======================================================
// FORM STATE
// ======================================================

export interface HelpDeskState {
  departmentId: number | null;

  categoryId: number | null;

  subCategoryId: number | null;

  assetNumber: string;

  location: string;

  contactNo: string;

  subject: string;

  description: string;
}

// ======================================================
// VALIDATION
// ======================================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ======================================================
// TICKET CARD PROPS
// ======================================================

export interface TicketCardProps {
  ticket: TicketItem;
}

// ======================================================
// TICKET REPLY DIALOG PROPS
// ======================================================

export interface TicketReplyDialogProps {
  open: boolean;

  onClose: () => void;

  ticketId: number;

  ticketNumber: string;

  // Information/request received from support team
  remarks: string;

  onSubmit: (
    ticketId: number,
    remarks: string,
    document?: File
  ) => Promise<boolean>;

  isSubmitting: boolean;
}

// ======================================================
// TICKET REOPEN DIALOG PROPS
// ======================================================

export interface TicketReopenDialogProps {
  open: boolean;

  onClose: () => void;

  ticketId: number;

  ticketNumber: string;

  onSubmit: (
    ticketId: number,
    remarks: string,
    document?: File
  ) => Promise<boolean>;

  isSubmitting: boolean;
}

// ======================================================
// TICKET DETAILS DIALOG PROPS
// ======================================================

export interface TicketDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  ticket: TicketItem;
}

// ======================================================
// TICKET TIMELINE PROPS
// ======================================================

export interface TicketTimelineProps {
  ticket: TicketItem;
}

// ======================================================
// EMPTY STATE PROPS
// ======================================================

export interface EmptyStateProps {
  title?: string;
  description?: string;
}

// ======================================================
// HELP DESK NAVBAR PROPS
// ======================================================

export interface HelpDeskNavbarProps {
  className?: string;
}

// ======================================================
// ATTACHMENT UPLOADER PROPS
// ======================================================

export interface AttachmentUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  maxSizeInMB?: number;
}

// ==================================================
// REPLY TICKET
// ==================================================

export interface ReplyTicketRequest {
  ticketId: number;
  remarks: string;
  document?: File;
}


// ==================================================
// REOPEN TICKET
// ==================================================

export interface ReopenTicketRequest {
  ticketId: number;
  remarks: string;
  document?: File;
}


// ==================================================
// TICKET ACTION RESPONSE
// ==================================================
//
// The documentation provided does not specify the
// exact response body for Reply/Reopen.
// Therefore, don't assume a response structure here.
//
export interface TicketActionResponse {
  StatusCode?: number;
  Message?: string;
  message?: string;
  success?: boolean;
}

// ==================================================
// KNOWLEDGE BASE
// ==================================================

export interface KnowledgeBaseItem {
  ID: number;
  Question: string;
  Answer: string;
}
export type KnowledgeBaseResponse = KnowledgeBaseItem[];