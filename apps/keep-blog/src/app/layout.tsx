import type { Metadata } from "next";
import { Libre_Baskerville, Philosopher, IBM_Plex_Mono, Lora } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/blog/sidebar";
import { ensureRootAdmin } from "@/lib/auth";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-sans",
});

const philosopher = Philosopher({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-heading",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Keep Coding Blog",
    template: "%s | Keep Coding Blog",
  },
  description: "Blog da Keep Coding — KeepBiz, Keep Solo, Business Model Canvas e estratégia de produto para PMEs.",
  keywords: ["Keep Coding", "KeepBiz", "Keep Solo", "Business Model Canvas", "PMEs", "automação", "agentes IA"],
  authors: [{ name: "Keep Coding" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Keep Coding Blog",
    title: "Keep Coding Blog",
    description: "Blog da Keep Coding — estratégia de produto, automação com IA e Business Model Canvas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  ensureRootAdmin();

  return (
    <html
      lang="pt-BR"
      className={`${libreBaskerville.variable} ${philosopher.variable} ${ibmPlexMono.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-screen font-sans antialiased">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </body>
    </html>
  );
}
