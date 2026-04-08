"use client";

import Faqs from "@/components/Faqs";
import Hero from "@/components/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/About";
import Domains from "@/components/Domains";
import TimeLine from "@/components/TimeLine";
import Sponsors from "@/components/Sponsors";
import Lenis from "lenis";

const Home = () => {
  // Initialize Lenis
  const lenis = new Lenis({
    autoRaf: true,
    smoothWheel: true,
    });

  lenis.on("scroll", (e) => {
    console.log(e);
  });

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
