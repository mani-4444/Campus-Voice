import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/components/app-context";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusVoice - Smart Feedback Platform",
  description: "AI-powered anonymous feedback and issue resolution for educational institutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
        </ThemeProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
