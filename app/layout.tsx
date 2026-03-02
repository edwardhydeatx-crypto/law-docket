import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LawFirm Docketing",
  description: "Law firm docket tracking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-primary-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold">⚖️ LawFirm Docket</span>
              </div>
              <div className="flex space-x-4">
                <a href="/" className="hover:bg-primary-600 px-3 py-2 rounded-md">Dashboard</a>
                <a href="/matters" className="hover:bg-primary-600 px-3 py-2 rounded-md">Matters</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
