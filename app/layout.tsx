import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Deskify",
  description: "Workspace Accessories Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
