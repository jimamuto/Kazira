import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Kazira | AI Career Stylist for Kenya",
  description: "Personalized AI career roadmaps for Kenyan developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-black text-white relative overflow-x-hidden">
        <ClientLayout>{children}</ClientLayout>
        <div className="glow-aura fixed top-[-10%] right-[-10%] opacity-40"></div>
        <div className="glow-aura-secondary fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/5 blur-[150px] -z-10 rounded-full opacity-20"></div>
      </body>
    </html>
  );
}
