import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Cabby | Premium Van Booking",
  description: "Book comfortable, luxurious inter-city van rides across Zambia. Travel in style between Lusaka, Ndola, Kitwe, and Kasumbalesa.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cabby",
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
};

export const viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        {/* Navigation placeholder */}
        <nav className="glass sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center transition-all bg-background/80">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-primary tracking-tight">Cabby</span>
          </div>
          <div className="flex gap-4">
            <button className="hidden text-sm font-medium md:flex items-center text-foreground/80 hover:text-primary transition-colors">
              Routes
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
              Sign In
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow flex flex-col">
          <AuthProvider>
            {children}
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
