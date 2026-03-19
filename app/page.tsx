import Faqs from "@/components/Faqs";
import Hero from "@/components/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Stats from "@/components/ui/Stats";
import React from "react";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Faqs />
      <Footer />
    </>
  );
};

export default Home;
