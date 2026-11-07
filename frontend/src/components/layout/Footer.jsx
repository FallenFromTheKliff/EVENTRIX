import EVENTRIX from "../../assets/images/EVENTRIX-Title.png";
import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";

const colors = { public: "bg-slate-900", USER: "bg-zinc-800", ADMIN: "bg-zinc-900" };

export default function Footer({ role = "public" }) {
  return (
    <footer className={`${colors[role]} px-16 pt-12 pb-8 text-gray-300`}>
      <div className="grid gap-12 lg:grid-cols-3">
        <div>
          <img src={EVENTRIX} alt="EVENTRIX" className="h-10" />
          <p className="text-base mt-5">
            EVENTRIX offers a simplified ticketing experience for live events & entertainment lovers, in other terms, it means your next experience starts here.
          </p>
        </div>
        <div className="flex flex-col lg:items-center">
          <h2 className="text-xl font-semibold text-white">
            Follow Us
          </h2>
          <div className="flex items-center gap-4 mt-5">
            <button className="transition duration-200 cursor-pointer hover:brightness-50">
              <IconBrandFacebook size={48} stroke={1.8} />
            </button>
            <button className="transition duration-200 cursor-pointer hover:brightness-50">
              <IconBrandInstagram size={48} stroke={1.8} />
            </button>
            <button className="transition duration-200 cursor-pointer hover:brightness-50">
              <IconBrandX size={48} stroke={1.8} />
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
      <div className="text-sm text-center border-t border-gray-700 mt-10 pt-4">
        © 2026 EVENTRIX. All rights reserved.
      </div>
    </footer>
  )
}