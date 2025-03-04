import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ApplicationProvider from "@/components/applicationProvider";
import { HeaderBar } from "@/components/headerBar";
import { ThemeProvider } from "@/components/themeProvider";





const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "E commerce",
  description: "Desenvolvido por akin fantucci",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <ApplicationProvider>
            <HeaderBar />
            <div className="flex min-h-screen flex-col bg-background border-border/40 dark:border-border min-[1800px]:max-w-[1536px] min-[1800px]:border-x mx-auto w-full ">
              {children}
              {modal}
              {/* <main className="flex-1"> */}
              {/* </main> */}
            </div>
            <footer className=" md:px-8 h-12 sticky bottom-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border  min-[1800px]:max-w-[1536px] min-[1800px]:border-x mx-auto ">
              <div className="container flex flex-col items-center justify-between gap-4  md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Feito por akin fantuci.
                </p>
              </div>
            </footer>
          </ApplicationProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );  
}
