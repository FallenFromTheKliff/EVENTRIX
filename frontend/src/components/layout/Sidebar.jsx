import { Link, NavLink } from "react-router";
import { IconArrowRight } from "@tabler/icons-react";

import { sectionsss, rolesss } from "../../data/navbox";
import EVENTRIX from "../../assets/images/EVENTRIX-Title.png";
import EVENTRIXNeon from "../../assets/images/EVENTRIX-Title-Neon.png";

const colors = { public: "bg-slate-900", USER: "bg-zinc-900" };

export default function Sidebar({ role = "public", mobile = false, isOpen, onClose, activeSection, onSectionClick }) {
  const items = rolesss[role]?.map(({ to, label }) => (
    <div key={to} className="border-t border-zinc-700 px-3 py-4">
      <NavLink
        to={to}
        onClick={onClose}
        className={({ isActive }) => `block rounded-md px-8 py-4 text-lg transition-colors duration-200 hover:bg-cyan-600 ${isActive ? "bg-cyan-500" : ""}`}
      >
        {label}
      </NavLink>
    </div>
  ));
  if (!mobile) return <nav className={`hidden lg:block ${colors[role]} w-65 shrink-0`}>{items}</nav>;

  return (
    <>
      {isOpen && <button onClick={onClose} className="fixed inset-0 z-101 bg-black/80 backdrop-blur-lg lg:hidden" />}
      <aside className={`flex flex-col items-center ${colors[role]} text-white fixed inset-y-0 left-0 z-101 w-72 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col items-center h-full">
          <img src={role === "public" ? EVENTRIX : EVENTRIXNeon} alt="EVENTRIX" className="w-full p-6" />
          {role === "public" ? (
            <>
              <div className="mb-6 h-px w-full bg-gray-700" />
              <nav className="flex flex-col w-full text-2xl gap-12 pl-6">
                {sectionsss.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => onSectionClick(id)}
                    className={`flex items-center gap-2 transition-colors duration-200 hover:text-cyan-400 ${activeSection === id ? "text-cyan-400" : ""}`}
                  >
                    {activeSection === id && <IconArrowRight size={28} />}
                    {label}
                  </a>
                ))}
              </nav>
              <div className="my-6 h-px w-full bg-gray-700" />
              <div className="w-full px-6">
                <Link to="/auth" state={{ mode: "login" }} onClick={onClose} className="block text-center text-xl bg-cyan-500 rounded-lg py-2">
                  LOGIN
                </Link>
              </div>
            </>
          ) : (
            <div className="w-full">{items}</div>
          )}
        </div>
      </aside>
    </>
  )
}