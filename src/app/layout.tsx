import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { RoadSosProvider } from "@/context/RoadSosContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RoadSOS 🚑 — AI + IoT Smart Emergency Rescue Network",
  description: "RoadSOS is a premium, real-time emergency response platform that automatically detects vehicle accidents, coordinates dispatch response, and tracks rescue logistics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-slate-900`}>
        <AuthProvider>
          <RoadSosProvider>
            {children}
          </RoadSosProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
