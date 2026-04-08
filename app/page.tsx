"use client";

import Faqs from "@/components/Faqs";
import Hero from "@/components/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/About";
import Domains from "@/components/Domains";
import TimeLine from "@/components/TimeLine";
import Sponsors from "@/components/Sponsors";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    let destroyed = false;
    let lenisInstance: { destroy?: () => void } | null = null;

    const setupLenis = async () => {
      const { default: Lenis } = await import("lenis");
      if (destroyed) return;

      lenisInstance = new Lenis({
        autoRaf: true,
        smoothWheel: true,
      });
    };

    setupLenis();

    return () => {
      destroyed = true;
      lenisInstance?.destroy?.();
    };
  }, []);

  return (
    <div className="">
      <Navbar />
      <Hero />
      <About />
      <Domains />
      <TimeLine />
      <Faqs />
      <Sponsors />
      <Footer />
    </div>
  );
};

export default Home;
