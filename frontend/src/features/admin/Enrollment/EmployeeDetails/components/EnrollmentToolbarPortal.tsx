// import { useEffect, useState, type ReactNode } from "react";
// import { createPortal } from "react-dom";

// import { ENROLLMENT_ACTIONS_SLOT_ID } from "./EnrollmentTabs";

// const EnrollmentToolbarPortal = ({ children }: { children: ReactNode }) => {
//   const [host, setHost] = useState<HTMLElement | null>(null);
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     setHost(document.getElementById(ENROLLMENT_ACTIONS_SLOT_ID));
//     setReady(true);
//   }, []);

//   if (!ready) return null;
//   if (!host) {
//     return <div className="mb-2 flex items-center justify-end gap-2.5">{children}</div>;
//   }
//   return createPortal(children, host);
// };

// export default EnrollmentToolbarPortal;









import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { ENROLLMENT_ACTIONS_SLOT_ID } from "./EnrollmentTabs";

const EnrollmentToolbarPortal = ({ children }: { children: ReactNode }) => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHost(document.getElementById(ENROLLMENT_ACTIONS_SLOT_ID));
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!host) {
    return <div className="mb-2 flex items-center justify-end gap-2.5">{children}</div>;
  }
  return createPortal(children, host);
};

export default EnrollmentToolbarPortal;