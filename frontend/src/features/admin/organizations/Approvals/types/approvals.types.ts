export type CompanyApproval = {
  id: string;
  companyName: string;
  requestType: string;
  status: string;
};

export type ApprovalsApiResponse = {
  data?: CompanyApproval[];
  items?: CompanyApproval[];
};