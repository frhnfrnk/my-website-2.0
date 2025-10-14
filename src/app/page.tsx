import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="hairline" />
      <About />
      <div className="hairline" />
      <Projects />
      <div className="hairline" />
      <Experience />
      <div className="hairline" />
      <TechStack />
      <div className="hairline" />
      <Contact />
      <Footer />
    </main>
  );
}
