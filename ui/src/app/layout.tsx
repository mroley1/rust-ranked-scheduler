import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Header from "./header";

export const metadata: Metadata = {
  title: "ranked scheduler",
  description: "collaborative sheduling app for weekly events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Header></Header>
      {children}
    </html>
  );
}
