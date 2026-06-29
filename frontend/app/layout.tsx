import type { Metadata } from "next";
import { Marcellus, Hanken_Grotesk } from "next/font/google";
import ThemeRegistry from "@/src/lib/theme/ThemeRegistry";
import StoreProvider from "@/src/lib/StoreProvider";
import ToastProvider from "@/src/components/ToastProvider";
import ConfirmProvider from "@/src/components/ConfirmProvider";
import "./globals.css";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maison",
  description: "Considered tailoring and fluid silhouettes, made to last beyond the season.",
};

// Set data-theme before hydration so the first paint matches the saved choice.
const noFlashScript = `(function(){try{var t=localStorage.getItem('maison-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" className={`${marcellus.variable} ${hanken.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <StoreProvider>
          <ThemeRegistry>
            <ToastProvider>
              <ConfirmProvider>{children}</ConfirmProvider>
            </ToastProvider>
          </ThemeRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
