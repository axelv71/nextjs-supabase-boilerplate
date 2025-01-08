import { cn } from '@/lib/utils';

type StepperProps = {
  length?: number;
  activeStep?: number;
};

export const Stepper = ({ length = 3, activeStep = 1 }: StepperProps) => {
  return (
    <div className="flex items-center space-x-1.5 w-full">
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-1 w-full rounded-full',
            activeStep >= index ? 'bg-[#1F1E24]' : 'bg-[#D9D9D9]',
          )}
        />
      ))}
      <span className="text-xs text-[#9CA3AF]">
        {activeStep + 1}/{length}
      </span>
    </div>
  );
};
