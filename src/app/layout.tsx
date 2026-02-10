import { Inter_Tight, PT_Sans_Caption, Fragment_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["400", "500", "700"],
});

const SansCaption = PT_Sans_Caption({
  subsets: ["latin"],
  variable: "--font-sans-caption",
  weight: ["400"],
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  variable: "--font-fragment-mono",
  weight: ["400"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="pt-BR" 
      className={`${interTight.variable} ${SansCaption.variable} ${fragmentMono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}