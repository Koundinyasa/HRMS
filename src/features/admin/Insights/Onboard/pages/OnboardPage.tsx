


import { Route, Routes } from "react-router-dom";

import OnboardLandingPage from "./OnboardLandingPage";
import OnboardConfirmationLetterPage from "./OnboardConfirmationLetterPage";
import ConfirmationLetterViewerPage from "./ConfirmationLetterViewerPage";
import OnboardReportsPage from "./OnboardReportsPage";

export default function OnboardPage() {
  return (
    <Routes>
      {/* Onboard home */}
      <Route
        index
        element={<OnboardLandingPage />}
      />

      {/* Confirmation Letter list */}
      <Route
        path="document/confirmation-letter"
        element={<OnboardConfirmationLetterPage />}
      />

      {/* Confirmation Letter viewer */}
      <Route
        path="document/confirmation-letter/:employeeId"
        element={<ConfirmationLetterViewerPage />}
      />

      {/* Other document routes */}
      <Route
        path="document/:docType"
        element={<OnboardConfirmationLetterPage />}
      />

      {/* Direct confirmation letter */}
      <Route
        path="confirmation-letter"
        element={<OnboardConfirmationLetterPage />}
      />

      {/* Other reports */}
      <Route
        path=":reportCategory"
        element={<OnboardReportsPage />}
      />
    </Routes>
  );
}