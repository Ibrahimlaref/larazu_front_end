import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/layout/CartDrawer";
import SearchModal from "@/components/layout/SearchModal";

interface Props {
  children: ReactNode;
}

export default function WrapperByHeaderOnly({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-chalk">
      <Navbar />
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <SearchModal />
    </div>
  );
}
