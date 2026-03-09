import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="w-full mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </main>
      <Footer />
    </>
  );
}