import type { Metadata } from 'next';
import { Anton, Montserrat, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { AppContextProvider } from '@/context/AppContext';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pleadings.in'),
  title: 'Pleadings — Real Indian Court Judgments as Verified Stories',
  description:
    'Pleadings transforms real, closed, verified Indian court cases into interactive courtroom thrillers, evidence reels, and law student briefs. Verified against the original/officially published judgment.',
  keywords: [
    'legal media',
    'indian law',
    'court judgments',
    'law students',
    'IPC 79',
    'IPC 300',
    'Nanavati case',
    'Shreya Singhal 66A',
    'Kesavananda Bharati',
    'MC Mehta Oleum Gas',
    'consumer law',
    'pleadings',
    'netflix for law',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${montserrat.variable} ${notoDevanagari.variable}`}
    >
      <body className="bg-[#0E1016] text-[#F3EFE6] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#0E1016] overflow-x-hidden min-h-screen">
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
