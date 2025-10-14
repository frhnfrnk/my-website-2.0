import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ProvidersV2 from "@/components/ProvidersV2";
import ThemeScriptV2 from "@/components/ThemeScriptV2";
import ToastContainer from "@/components/ToastContainer";
import ScrollTopFab from "@/components/ScrollTopFab";
import IconSidebarWrapper from "@/components/IconSidebarWrapper";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "by Farhan Franaka",
  description:
    "Frontend Engineer & Web Developer specializing in modern web technologies and elegant user experiences.",
  keywords: [
    "Frontend Engineer",
    "Web Developer",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Farhan Franaka" }],
  openGraph: {
    title: "Farhan Franaka — Frontend Engineer",
    description:
      "Frontend Engineer & Web Developer specializing in modern web technologies and elegant user experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <ThemeScriptV2 />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ProvidersV2>
          <IconSidebarWrapper />
          {children}
        </ProvidersV2>
        <ToastContainer />
        <ScrollTopFab />
      </body>
    </html>
  );
}
