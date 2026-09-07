import type { Branch } from "../types/classificationTypes";

// Shown only as a fallback when the backend returns zero branches, so the
// screen matches the reference design out of the box. Once real rows exist
// in the database, useGetBranchesQuery's data takes over and this is
// ignored. Id starts at 9000 to stay out of the way of real DB ids.
export const SEED_BRANCHES: Branch[] = [
  {
    Id: 9001,
    BranchName: "Koundinyasa Technology Services Pvt. Ltd",
    Address: "Hyderabad",
    State: "Telangana",
    IsActive: 1,
  },
];
