import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/components/app-context";
import { Toaster } from "@/components/ui/sonner";

// orchids-visual-edits is optional — only loaded if installed in dev
let VisualEditsMessenger: React.ComponentType = () => null;
if (process.env.NODE_ENV === "development") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    VisualEditsMessenger = require("orchids-visual-edits").VisualEditsMessenger;
  } catch {
    // Package not installed — skip silently
  }
}

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusVoice - Smart Feedback Platform",
  description:
    "AI-powered anonymous feedback and issue resolution for educational institutions",
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
          <VisualEditsMessenger />
        </ThemeProvider>
      </body>
    </html>
  );
}
