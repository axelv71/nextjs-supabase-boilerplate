import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const aeonik = localFont({
  src: [
    {
      path: './aeonik-pro/Aeonik-Pro-Medium.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-aeonik',
});

export const britti = localFont({
  src: [
    {
      path: './britti-sans/BrittiSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-britti',
});

export const inter = Inter({
  weight: ['300', '400', '500', '600', '700', '900'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
