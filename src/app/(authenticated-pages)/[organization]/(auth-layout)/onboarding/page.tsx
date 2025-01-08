'use client';

import React from 'react';
import { toast } from 'sonner';
import { saveOnboarding } from '@/actions/onboarding';
import { Brand } from '@/components/auth/brand';
import { PrimaryBadge } from '@/components/ui/primary-badge';
import { RadioGroup } from '@/components/ui/radio-group';
import { Stepper } from '@/components/ui/stepper';
import { RoundedButton } from '@/components/ui/rounded-button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  OptionRadioButton,
  RadioButtonOption,
} from '@/components/onboarding/option-radio-button';
import {
  Briefcase01,
  Code02,
  GraduationHat02,
  Mail02,
  Palette,
  PencilLine,
  PhoneCall01,
  PlusCircle,
  TrendUp01,
  UserCircle,
  VideoRecorder,
  LayoutAlt01,
  Users03,
} from '@/assets/icons';

export default function Page() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>(
    Array(steps.length).fill(''),
  );

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Log the final results once we reach the last step
      console.log('Selected options:', selectedOptions);
      toast.promise(saveOnboarding(selectedOptions), {
        loading: 'Saving...',
        success: 'Saved!',
        error: 'Failed to save',
      });
    }
  };

  const handleSelectOption = (option: string) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentStep] = option;
    setSelectedOptions(updatedOptions);
  };

  const handleSkip = () => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentStep] = '';
    setSelectedOptions(updatedOptions);
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <Brand />
      <div className="space-y-6">
        <div className="space-y-4 2xl:space-y-5">
          <PrimaryBadge>Onboarding</PrimaryBadge>
          <h1 className="font-britti font-medium text-4xl 2xl:text-5xl">
            {steps[currentStep].title}
          </h1>
          <p className="text-[#5F6064] tracking-wide">
            Select the option that best describes what you’re doing.
          </p>
        </div>
        <RadioGroup
          className={cn(
            steps[currentStep].options.length > 6
              ? 'grid grid-cols-2 gap-y-3 gap-x-3'
              : 'space-y-1.5',
          )}
          onValueChange={(value) => handleSelectOption(value)}
          value={selectedOptions[currentStep]}
        >
          {steps[currentStep].options.map((option, index) => (
            <OptionRadioButton
              option={option}
              key={index}
              selectedOption={selectedOptions[currentStep]}
              className={cn(
                steps[currentStep].options.length > 6 &&
                  steps[currentStep].options.length % 2 !== 0 &&
                  index === steps[currentStep].options.length - 1
                  ? 'col-span-2'
                  : '',
              )}
            />
          ))}
        </RadioGroup>
        <RoundedButton
          className="w-full"
          onClick={handleNext}
          disabled={
            !selectedOptions[currentStep] && currentStep !== steps.length - 1
          } // Disable Next if no option selected
        >
          {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          <ArrowRight className="ml-2 size-4" />
        </RoundedButton>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <RoundedButton
            size="sm"
            variant="ghost"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back
          </RoundedButton>
          <RoundedButton
            size="sm"
            variant="ghost"
            onClick={handleSkip}
            disabled={currentStep === steps.length - 1}
          >
            Skip
            <ArrowRight className="ml-2 size-4" />
          </RoundedButton>
        </div>
        <Stepper length={steps.length} activeStep={currentStep} />
      </div>
    </div>
  );
}

interface step {
  title: string;
  description: string;
  options: RadioButtonOption[];
}

const steps: step[] = [
  {
    title: 'What best describes your role?',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    options: [
      {
        label: 'Freelancer',
        description: 'eg. solo designer, copywriter, mediabuyer...',
        icon: UserCircle,
        arrow: true,
      },
      {
        label: 'Agency Owner',
        description: 'eg. design/dev studio, leadgen agency...',
        icon: Briefcase01,
        arrow: true,
      },
      {
        label: 'Coach / Consulting',
        description: 'eg. business coach, company advisor... ',
        icon: GraduationHat02,
        arrow: true,
      },
      {
        label: 'Other',
        icon: PlusCircle,
        arrow: true,
      },
    ],
  },
  {
    title: 'What type of services do you sell?',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    options: [
      {
        label: 'Design',
        icon: Palette,
      },
      {
        label: 'Development',
        icon: Code02,
      },
      {
        label: 'Media Buying',
        icon: TrendUp01,
      },
      {
        label: 'Copywriting',
        icon: PencilLine,
      },
      {
        label: 'Emailing',
        icon: Mail02,
      },
      {
        label: 'Video Editing',
        icon: VideoRecorder,
      },
      {
        label: 'Sales',
        icon: PhoneCall01,
      },
      {
        label: 'CRM',
        icon: LayoutAlt01,
      },
      {
        label: 'Leadgen',
        icon: Users03,
      },
      {
        label: 'Other',
        icon: PlusCircle,
      },
    ],
  },
  {
    title: 'How many proposals are you sending?',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    options: [
      { label: '1 to 5 Proposals per month' },
      { label: '10 to 20 Proposals per month' },
      { label: '20 - 50 Proposals per month' },
      { label: '50+ Proposals per month' },
    ],
  },
  {
    title: 'How much revenue are you generating with your activity?',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    options: [
      {
        label: '$0 - $10’000/m',
      },
      {
        label: '$10’000/m - $20’000/m',
      },
      {
        label: '$20’000/m - $50’000/m',
      },
      {
        label: '$50’000/m - $100’000/m',
      },
      {
        label: '> $100’000/m',
      },
    ],
  },
];
