"use client";

export interface StepConfig {
  number: number;
  label: string;
  completed: boolean;
  current: boolean;
}

interface StepperProps {
  currentStep: number;
  activeStep: number;
  onStepClick: (step: number) => void;
  children?: React.ReactNode;
}

const STEP_LABELS = ["Idea", "Framework", "Script", "Editor", "Review", "Publicado"];

export function Stepper({ currentStep, activeStep, onStepClick, children }: StepperProps) {
  const steps: StepConfig[] = STEP_LABELS.map((label, i) => ({
    number: i + 1,
    label,
    completed: i + 1 < currentStep,
    current: i + 1 === currentStep,
  }));

  return (
    <div>
      {/* Stepper navigation */}
      <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <div key={step.number} className="flex items-center shrink-0">
            <button
              onClick={() => onStepClick(step.number)}
              className={`
                group flex items-center gap-2 rounded-[10px] px-3 py-2.5 min-h-[44px]
                transition-all duration-300
                ${activeStep === step.number
                  ? "bg-accent-secondary"
                  : "hover:bg-[rgba(255,255,255,0.03)]"
                }
              `}
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              <div
                className={`
                  flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-500
                  transition-all duration-300
                  ${step.completed
                    ? "bg-accent text-white"
                    : step.current
                    ? "border-2 border-accent text-accent"
                    : activeStep === step.number
                    ? "border border-accent/50 text-accent"
                    : "border border-border-subtle text-text-muted"
                  }
                `}
                style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                {step.completed ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`
                  text-[12px] font-400 whitespace-nowrap
                  transition-colors duration-300
                  ${activeStep === step.number ? "text-text-primary" : "text-text-secondary"}
                  ${step.completed ? "text-text-body" : ""}
                `}
              >
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-4 shrink-0 ${
                  step.completed ? "bg-accent" : "bg-border-subtle"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step panel */}
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

export function StepPanel({
  step,
  activeStep,
  children,
}: {
  step: number;
  activeStep: number;
  children: React.ReactNode;
}) {
  if (step !== activeStep) return null;

  return (
    <div
      className="rounded-[16px] border border-border-subtle bg-bg-surface p-6 reveal"
    >
      {children}
    </div>
  );
}
