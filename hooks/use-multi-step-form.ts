import { useMemo, useState } from "react";

export function useMultiStepForm(steps: React.ReactNode[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const step = useMemo(() => steps[currentStepIndex], [steps, currentStepIndex]);

  function next() {
    setCurrentStepIndex((index) => Math.min(index + 1, steps.length - 1));
  }

  function back() {
    setCurrentStepIndex((index) => Math.max(index - 1, 0));
  }

  return {
    currentStepIndex,
    step,
    isFirstStep,
    isLastStep,
    next,
    back,
  };
}
