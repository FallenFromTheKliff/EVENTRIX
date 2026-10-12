import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { IconMenu2 } from "@tabler/icons-react";

import EVENTRIX from "../../assets/images/EVENTRIX-Title.png";
import MobSidebar from "./MobSidebar";

export default function Header() {
  const [sideStep, setSideStep] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const sectionIds = ["home", "about", "support", "questions"];
    const updateObserver = () => {
      const bottomMargin = window.innerHeight - 80 - 1;

      const sections = sectionIds.map((id) => document.getElementById(id)).filter((section) => section !== null);
      if (!sections.length) return;

      const observer = new IntersectionObserver(() => {
          const trackingPosition = window.scrollY + 80;
          let currentSection = "home";
          sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            if (sectionTop <= trackingPosition) { currentSection = section.id; }
          });
          setActiveSection(currentSection);
          window.history.replaceState(null, "", `#${currentSection}`);
        }, { rootMargin: `-${80}px 0px -${bottomMargin}px 0px`, threshold: 0 }
      );
      sections.forEach((section) => observer.observe(section));
      return observer;
    };

    let observer = updateObserver();
    return () => { observer.disconnect(); };
  }, [location.pathname]);

  const handleSection = (id) => {
    setActiveSection(id);
    window.history.replaceState(null, "", `#${id}`);
    setSideStep(false);
  };

  if (location.pathname === "/auth") return null;
  
  return (
    <nav className="fixed inset-x-0 top-0 z-100 font-word bg-slate-950 text-white">
      <div className="flex justify-between items-center h-20 px-16">
        <img src={EVENTRIX} alt="EVENTRIX" className="absolute left-1/2 h-10 -translate-x-1/2 lg:static lg:translate-x-0" />
        <div className="hidden lg:flex items-center gap-8">
          <a 
            href="#home" 
            onClick={() => handleSection("home")} 
            className={`text-xl transition-colors duration-200 hover:text-cyan-400 ${activeSection === "home" ? "underline underline-offset-8" : ""}`}
          >
            Home
          </a>
          <a 
            href="#about" 
            onClick={() => handleSection("about")} 
            className={`text-xl transition-colors duration-200 hover:text-cyan-400 ${activeSection === "about" ? "underline underline-offset-8" : ""}`}
          >
            About
          </a>
          <a 
            href="#support" 
            onClick={() => handleSection("support")} 
            className={`text-xl transition-colors duration-200 hover:text-cyan-400 ${activeSection === "support" ? "underline underline-offset-8" : ""}`}
          >
            Support
          </a>
          <a 
            href="#questions" 
            onClick={() => handleSection("questions")} 
            className={`text-xl transition-colors duration-200 hover:text-cyan-400 ${activeSection === "questions" ? "underline underline-offset-8" : ""}`}
          >
            FAQs
          </a>
          <span className="text-xl text-gray-500">|</span>
          <Link to="/auth" state={{ mode: "login" }} className="text-xl bg-cyan-500 rounded-lg px-12 py-2">
            LOGIN
          </Link>
        </div>
        <button className="lg:hidden cursor-pointer" onClick={() => setSideStep(true)}><IconMenu2 size={32} /></button>
      </div>
      <MobSidebar
        isOpen={sideStep}
        onClose={() => setSideStep(false)}
        activeSection={activeSection}
        onSectionClick={handleSection}
      />
    </nav>
  )
}