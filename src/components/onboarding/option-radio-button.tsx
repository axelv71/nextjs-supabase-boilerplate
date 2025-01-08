import { RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import React, { SVGProps } from 'react';
import { ArrowRight } from 'lucide-react';

export interface RadioButtonOption {
  label: string;
  description?: string;
  // eslint-disable-next-line no-unused-vars
  icon?: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
  // eslint-disable-next-line no-unused-vars
  arrow?: boolean;
}

type OptionRadioButtonProps = {
  option: RadioButtonOption;
  selectedOption: string;
  className?: string;
};

export const OptionRadioButton = ({
  option,
  selectedOption,
  className,
}: OptionRadioButtonProps) => {
  const isActive = selectedOption === option.label;

  if (option.icon) {
    const Icon = option.icon;

    return (
      <label
        htmlFor={option.label}
        className={cn(
          'flex items-center space-x-2 border border-[#D1D5DB] px-4 py-4 rounded-xl cursor-pointer',
          isActive ? 'bg-[#F3F4F6]' : '',
          className,
        )}
      >
        <div className="w-full flex items-center">
          <div className="flex space-x-2 w-full">
            <Icon
              className={cn(
                'min-w-5 min-h-5 size-5 fill-[#EAEAEA]',
                isActive ? '' : 'text-[#7F8082]',
              )}
            />
            <div className="flex flex-col space-y-1 w-full">
              <span className="font-medium text-sm">{option.label}</span>
              {option.description && (
                <span
                  className={cn('text-sm', isActive ? '' : 'text-[#5F6064]')}
                >
                  {option.description}
                </span>
              )}
            </div>
          </div>
          <div className="h-full flex items-center justify-center">
            <RadioGroupItem
              value={option.label}
              id={option.label}
              className={cn(
                'border-border shadow-none',
                option.arrow ? 'hidden' : '',
              )}
            />
            {option.arrow && <ArrowRight className={cn('size-4')} />}
          </div>
        </div>
      </label>
    );
  }

  return (
    <label
      htmlFor={option.label}
      className={cn(
        'flex items-center space-x-2 border border-[#D1D5DB] px-4 py-4 rounded-xl cursor-pointer',
        isActive ? 'bg-[#F3F4F6]' : '',
        className,
      )}
    >
      <RadioGroupItem
        value={option.label}
        id={option.label}
        className="border-border shadow-none"
      />
      <span
        className={cn('font-medium text-sm', isActive ? '' : 'text-[#5F6064]')}
      >
        {option.label}
      </span>
    </label>
  );
};
