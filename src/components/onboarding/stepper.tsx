import { cn } from '@/lib/utils';

type StepperProps = {
  length: number;
  currentStep: number;
};

export const Stepper = ({ length, currentStep }: StepperProps) => {
  return (
    <div className="flex items-center space-x-1.5">
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-2.5 rounded-full',
            currentStep === index
              ? 'w-10 bg-gradient-to-r shadow-onboarding-stepper-active from-[#84C8FD] via-[#4B88EF] to-[#1744B2]'
              : 'bg-[#E5E6EA] border border-[#D2D3D7] w-2.5',
          )}
        />
      ))}
    </div>
  );
};
