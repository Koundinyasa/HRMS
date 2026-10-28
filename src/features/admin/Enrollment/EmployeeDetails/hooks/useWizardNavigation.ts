// import { useState, useCallback } from "react";

// export const useWizardNavigation = (totalSteps: number) => {
//   const [stepIndex, setStepIndex] = useState(0);

//   const isFirst = stepIndex === 0;
//   const isLast = stepIndex === totalSteps - 1;

//   const goNext = useCallback(() => {
//     setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
//   }, [totalSteps]);

//   const goBack = useCallback(() => {
//     setStepIndex((prev) => Math.max(prev - 1, 0));
//   }, []);

//   const goToStep = useCallback(
//     (index: number) => {
//       if (index >= 0 && index < totalSteps) {
//         setStepIndex(index);
//       }
//     },
//     [totalSteps]
//   );

//   const resetSteps = useCallback(() => {
//     setStepIndex(0);
//   }, []);

//   return {
//     stepIndex,
//     isFirst,
//     isLast,
//     goNext,
//     goBack,
//     goToStep,
//     resetSteps,
//     setStepIndex,
//   };
// };














import { useState, useCallback } from "react";

export const useWizardNavigation = (totalSteps: number) => {
  const [stepIndex, setStepIndex] = useState(0);

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  const goNext = useCallback(() => {
    setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const goBack = useCallback(() => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSteps) {
        setStepIndex(index);
      }
    },
    [totalSteps]
  );

  const resetSteps = useCallback(() => {
    setStepIndex(0);
  }, []);

  return {
    stepIndex,
    isFirst,
    isLast,
    goNext,
    goBack,
    goToStep,
    resetSteps,
    setStepIndex,
  };
};