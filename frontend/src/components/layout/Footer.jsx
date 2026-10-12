import EVENTRIX from "../../assets/images/EVENTRIX-Title.png";
import { useLocation } from "react-router";
import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";

export default function Footer() {
  const location = useLocation();
  if (location.pathname === "/auth") return null;

  return (
    <footer className="bg-slate-900 px-16 pt-12 pb-8 font-word text-gray-300">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <img src={EVENTRIX} alt="EVENTRIX" className="h-10" />
          <p className="text-lg mt-5">
            Your next unforgettable experience starts here.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <button className="transition-colors duration-200 hover:text-white cursor-pointer">
              <IconBrandFacebook size={28} stroke={1.8} />
            </button>
            <button className="transition-colors duration-200 hover:text-white cursor-pointer">
              <IconBrandInstagram size={28} stroke={1.8} />
            </button>
            <button className="transition-colors duration-200 hover:text-white cursor-pointer">
              <IconBrandX size={28} stroke={1.8} />
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">
            Contact Us
          </h2>
          <div className="text-lg mt-5 space-y-4">
            <div className="flex items-center gap-3">
              <IconMail size={22} stroke={1.8} />
              <span>info@eventrix.com</span>
            </div>
            <div className="flex items-center gap-3">
              <IconPhone size={22} stroke={1.8} />
              <span>+63 912 354 6789</span>
            </div>
            <div className="flex items-start gap-3">
              <IconMapPin size={22} stroke={1.8} className="mt-1" />
              <span>EVENTRIX Tower, Makati City, Philippines</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm text-center border-t border-gray-800 mt-10 pt-4">
        © 2026 EVENTRIX. All rights reserved.
      </div>
    </footer>
  )
}