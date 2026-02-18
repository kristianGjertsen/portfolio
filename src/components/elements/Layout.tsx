import type { ReactNode } from "react";
import Header from "../pageSections/Header";
import Footer from "../pageSections/Footer";

type LayoutProps = {
  children: ReactNode;
  className?: string;
  mainClassName?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
};

function Layout({
  children,
  className = "",
  mainClassName = "",
  hideHeader = false,
  hideFooter = false,
}: LayoutProps) {
  return (
    <div
      className={`relative flex min-h-[100svh] flex-col bg-paper text-ink ${className}`}
    >
      {!hideHeader && <Header />}

      <main className={`flex-1 ${mainClassName}`}>
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default Layout;
