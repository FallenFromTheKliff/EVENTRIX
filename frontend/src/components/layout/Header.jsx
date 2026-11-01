import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { IconBellFilled, IconChevronDown, IconChevronUp, IconHeartFilled, IconLogout, IconMenu2, IconShoppingCartFilled } from "@tabler/icons-react";

import { useAuth } from "../../context/AuthContext";
import { useEvents } from "../../context/EventContext";
import { useCart } from "../../context/CartContext";

import { sectionsss, menusss } from "../../data/navbox";
import EVENTRIX from "../../assets/images/EVENTRIX-Title.png";
import EVENTRIXNeon from "../../assets/images/EVENTRIX-Title-Neon.png";
import Placeholder from "../../assets/images/EVENTRIX-Placeholder.jpeg"

import useLoadingText from "../ui/useLoadingText";
import ConfirmModal from "../ui/ConfirmModal";
import Sidebar from "./Sidebar";

const colors = { public: "bg-slate-950", USER: "bg-zinc-800", ADMIN: "bg-cyan-500" };

export default function Header({ role = "public" }) {
  const { profile, logout } = useAuth();
  const { favoritesOnly, toggleFavoritesOnly } = useEvents();
  const { cartItems } = useCart();
  const { loading, runner, texter } = useLoadingText();
  const { pathname } = useLocation();

  const [sideStep, setSideStep] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (role !== "public") return;
    const sections = sectionsss.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(() => {
      const trackingPosition = window.scrollY + 80;
      let currentSection = "home";
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top + window.scrollY <= trackingPosition) currentSection = section.id;
      });
      setActiveSection(currentSection);
      window.history.replaceState(null, "", `#${currentSection}`);
    }, { rootMargin: `-80px 0px -${window.innerHeight - 81}px 0px`, threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [role]);

  const handleSection = (id) => {
    setActiveSection(id);
    window.history.replaceState(null, "", `#${id}`);
    setSideStep(false);
  };
  const handleLogout = () => runner(logout);

  if (role === "public" && pathname !== "/") return null;

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-100 ${colors[role]} text-white`}>
        <div className={`flex justify-between items-center h-20 ${role === "public" ? "px-16" : ""}`}>
          {role === "public" ? (
            <>
              <img src={EVENTRIX} alt="EVENTRIX" className="absolute left-1/2 h-10 -translate-x-1/2 lg:static lg:translate-x-0" />
              <div className="hidden lg:flex items-center gap-8">
                {sectionsss.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => handleSection(id)}
                    className={`text-xl transition-colors duration-200 hover:text-cyan-400 ${activeSection === id ? "underline underline-offset-8" : ""}`}
                  >
                    {label}
                  </a>
                ))}
                <span className="text-xl text-gray-500">|</span>
                <Link to="/auth" state={{ mode: "login" }} className="text-xl bg-cyan-500 rounded-lg px-12 py-2">
                  LOGIN
                </Link>
              </div>
              <button className="lg:hidden cursor-pointer" onClick={() => setSideStep(true)}>
                <IconMenu2 size={32} />
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 pl-6 lg:pl-4">
                <button className="lg:hidden cursor-pointer" onClick={() => setSideStep(true)}>
                  <IconMenu2 size={32} />
                </button>
                {role === "ADMIN" ? (
                  <img src={EVENTRIX} alt="EVENTRIX" className="h-8 max-lg:hidden" />
                ) : (
                  <img src={EVENTRIXNeon} alt="EVENTRIX" className="h-8 max-lg:hidden" />
                )}
              </div>
              <div className="flex items-center gap-6 pr-6 lg:pr-10">
                {role === "USER" && (
                  <>
                    {pathname === "/events" && (
                      <button onClick={toggleFavoritesOnly} className={`cursor-pointer transition duration-200 hover:brightness-50 ${favoritesOnly ? "text-red-500" : ""}`}>
                        <IconHeartFilled size={32} />
                      </button>
                    )}
                    <Link to="/cart" className="relative transition duration-200 hover:brightness-50">
                      <IconShoppingCartFilled size={32} />
                      {cartItems.length > 0 && <span className="absolute top-0 right-0 bg-cyan-500 size-3 rounded-full" />}
                    </Link>
                  </>
                )}
                <button type="button" className="cursor-pointer transition duration-200 hover:brightness-50">
                  <IconBellFilled size={32} />
                </button>
                {menuOpen && <button onClick={() => setMenuOpen(false)} className="fixed inset-0 z-10 cursor-default" />}
                <div className="relative z-20">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 cursor-pointer transition duration-200 hover:brightness-50">
                    <img src={profile?.profileImageUrl || Placeholder} alt="Gojo" className="size-14 rounded-full object-cover" />
                    {menuOpen ? <IconChevronUp size={24} /> : <IconChevronDown size={24} />}
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full bg-zinc-900 mt-3 w-48 overflow-hidden rounded-md border border-zinc-700 shadow-lg shadow-black transition duration-200 starting:opacity-0 starting:-translate-y-2">
                      {menusss.map(({ to, label, icon: Icon }) => (
                        <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 transition-colors duration-200 hover:bg-cyan-600">
                          <Icon size={20} />
                          {label}
                        </Link>
                      ))}
                      <div className="h-px w-full bg-gray-700" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setConfirming(true);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 hover:bg-red-600"
                      >
                        <IconLogout size={20} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <Sidebar mobile role={role} isOpen={sideStep} onClose={() => setSideStep(false)} activeSection={activeSection} onSectionClick={handleSection} />
      </nav>
      {confirming && (
        <ConfirmModal
          message="Log out?"
          description="You will need to sign in again to access your account."
          confirmText={texter("LOGOUT", "LOGGING OUT")}
          loading={loading}
          onConfirm={handleLogout}
          onClose={() => setConfirming(false)}
        />
      )}
    </>
  )
}