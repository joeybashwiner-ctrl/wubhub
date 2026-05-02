import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "wubhub — bst for the rave underground",
  description: "Buy, sell, and trade festival merch. Hoodies, pashminas, totems, drops.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Header />
          <main className="min-h-screen pb-32">{children}</main>
          <footer className="border-t border-line py-6 px-6 text-center">
            <span className="label">© wubhub — built underground · v0.1 prototype</span>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
