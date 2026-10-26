export interface AddCandidateRow {
  id: number;
  name: string;
  email: string;
  mobile: string;
  joining: string;
  status: string;
  verification: string;
  progress: number;
}

export const addCandidates: AddCandidateRow[] = [
  {
    id: 1,
    name: "Niveditha P M",
    email: "niveditham846@gmail.com",
    mobile: "6374935593",
    joining: "08/Jun/2026",
    status: "1/5",
    verification: "Verified",
    progress: 20,
  },
  {
    id: 2,
    name: "Nandhini Vakati",
    email: "nandhininandhu1608@gmail.com",
    mobile: "8179323581",
    joining: "28/May/2026",
    status: "1/5",
    verification: "Verified",
    progress: 20,
  },
  {
    id: 3,
    name: "Murali Krishna Putla",
    email: "muralikrishnaputla@gmail.com",
    mobile: "9014236262",
    joining: "11/May/2026",
    status: "0/5",
    verification: "Verified",
    progress: 0,
  },
  {
    id: 4,
    name: "Shreya Dandu",
    email: "dandushreya240@gmail.com",
    mobile: "7093799030",
    joining: "02/Feb/2026",
    status: "2/5",
    verification: "Unverified",
    progress: 40,
  },
  {
    id: 5,
    name: "RAJESH U",
    email: "rajesh.ubapally6781@gmail.com",
    mobile: "9542818517",
    joining: "01/Jan/2026",
    status: "0/5",
    verification: "Verified",
    progress: 0,
  },
];

export function getAddCandidateById(id: number) {
  return addCandidates.find((candidate) => candidate.id === id);
}

export function updateAddCandidate(
  id: number,
  changes: Partial<AddCandidateRow>,
) {
  const candidate = getAddCandidateById(id);

  if (candidate) {
    Object.assign(candidate, changes);
  }

  return candidate;
}

const addedCandidatesStorageKey = "pre-enrollment-added-candidates";

export function getAddedCandidates(): AddCandidateRow[] {
  try {
    const storedCandidates = window.localStorage.getItem(addedCandidatesStorageKey);
    return storedCandidates ? (JSON.parse(storedCandidates) as AddCandidateRow[]) : [];
  } catch {
    return [];
  }
}

export function saveAddedCandidate(candidate: AddCandidateRow) {
  const candidates = [candidate, ...getAddedCandidates()];
  window.localStorage.setItem(addedCandidatesStorageKey, JSON.stringify(candidates));
}

