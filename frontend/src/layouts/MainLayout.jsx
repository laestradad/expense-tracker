import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <main>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}