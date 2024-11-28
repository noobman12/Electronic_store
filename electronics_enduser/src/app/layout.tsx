import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import "./globals.css";
import HeaderApp from "@/components/HeaderApp";
import FooterApp from '@/components/FooterApp';
import React from "react";
import 'react-loading-skeleton/dist/skeleton.css'
import ClientSessionProvider from "@/components/ClientSessionProvider";

export const metadata: Metadata = {
  title: "Electronics",
  description: "Siêu thị điện máy",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      </head>
      <body>
        <ClientSessionProvider>
          <div className="container-fluid padding-unset-h">
              <HeaderApp />
              {children}
              <FooterApp />
          </div>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
