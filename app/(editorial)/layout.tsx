import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function EditorialLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      {/* Ambient depth without 3D — a single soft purple bloom at the crown. */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "radial-gradient(120% 70% at 50% -10%, rgba(204,255,0,0.10), transparent 60%)" }}
      />
      <Navbar />
      <div className="grain" aria-hidden="true" />
      {children}
      <Footer />
    </>
  );
}
