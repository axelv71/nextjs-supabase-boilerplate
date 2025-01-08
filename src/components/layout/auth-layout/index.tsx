import React from 'react';
import Image from 'next/image';
import Brands from '@/assets/img/brands.png';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="grid xl:grid-cols-2 min-h-dvh">
      <div className="px-10 sm:px-20 2xl:px-36 py-8">{children}</div>
      <div className="bg-[#F3F4F6] hidden xl:flex justify-center items-center">
        <div className="flex flex-col items-center space-y-6">
          <p className="font-inter font-medium text-center text-[#1F1E24]">
            High performing agencies and freelancers use ProPal to <br /> close
            sales every day.
          </p>
          <Image src={Brands} alt="Brands" width={450} />
        </div>
      </div>
    </div>
  );
};
