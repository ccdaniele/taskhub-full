import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from './components/ClientWrapper'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TaskHub - DIY Project Manager",
  description: "Organize, track, and manage your DIY projects with ease. TaskHub helps you stay on top of tasks, budgets, and deadlines.",
  keywords: "DIY, project management, task tracking, home improvement, organization",
  authors: [{ name: "TaskHub Team" }],
  creator: "TaskHub",
  openGraph: {
    title: "TaskHub - DIY Project Manager",
    description: "Organize, track, and manage your DIY projects with ease.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 min-h-screen`}
      >
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
