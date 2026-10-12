import EVENTRIX from "../../assets/images/EVENTRIX-Title.png";
import { Link } from "react-router";
import { IconArrowRight } from "@tabler/icons-react";

export default function MobSidebar({ isOpen, onClose, activeSection, onSectionClick }) {
  return (
    <>
      {isOpen && (
        <button onClick={onClose} className="fixed inset-0 z-101 bg-black/80 lg:hidden" />
      )}
      <aside className={`fixed inset-y-0 left-0 z-101 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col items-center h-full">
          <img src={EVENTRIX} alt="EVENTRIX" className="w-full p-6" />
          <div className="mb-6 h-px w-full bg-gray-700" />
          <nav className="flex flex-col w-full text-2xl gap-12 pl-6">
            <a
              href="#home"
              onClick={() => onSectionClick("home")}
              className={`flex items-center gap-2 transition-colors duration-200 hover:text-cyan-400 ${activeSection === "home" ? "text-cyan-400" : ""}`}
            >
              {activeSection === "home" && (<IconArrowRight size={28} />)}
              Home
            </a>
            <a
              href="#about"
              onClick={() => onSectionClick("about")}
              className={`flex items-center gap-2 transition-colors duration-200 hover:text-cyan-400 ${activeSection === "about" ? "text-cyan-400" : ""}`}
            >
              {activeSection === "about" && (<IconArrowRight size={28} />)}
              About
            </a>
            <a
              href="#support"
              onClick={() => onSectionClick("support")}
              className={`flex items-center gap-2 transition-colors duration-200 hover:text-cyan-400 ${activeSection === "support" ? "text-cyan-400" : ""}`}
            >
              {activeSection === "support" && (<IconArrowRight size={28} />)}
              Support
            </a>
            <a
              href="#questions"
              onClick={() => onSectionClick("questions")}
              className={`flex items-center gap-2 transition-colors duration-200 hover:text-cyan-400 ${activeSection === "questions" ? "text-cyan-400" : ""}`}
            >
              {activeSection === "questions" && (<IconArrowRight size={28} />)}
              FAQs
            </a>
          </nav>
          <div className="my-6 h-px w-full bg-gray-700" />
          <div className="w-full pl-6 pr-6">
            <Link to="/auth" state={{ mode: "login" }} onClick={onClose} className="block text-center text-xl bg-cyan-500 rounded-lg py-2">
              LOGIN
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}