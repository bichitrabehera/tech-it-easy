"use client";

import Faqs from "@/components/Faqs";
import Hero from "@/components/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import { ReactLenis } from "lenis/react";
import { useRef, useEffect } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import About from "@/components/About";
import Domains from "@/components/Domains";

const Home = () => {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = lenisRef.current?.lenis;

    if (!lenis) return;

    // 🔥 Sync Lenis with GSAP
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
   <div className="">
     {/* <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
      }}
    > */}
      <Navbar />
      <Hero />
      <About />
      <Domains/>
      <Faqs />
      <Footer />
    {/* </ReactLenis> */}
   </div>
  );
};

export default Home;