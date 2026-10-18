import { Outlet } from "react-router";

import { useAuth } from "../../context/AuthContext";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const colors = { USER: "bg-zinc-700", ADMIN: "bg-zinc-800" };

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <div className={`flex flex-col ${colors[user.role]} text-white font-word`}>
      <Header role={user.role} />
      <div className="flex min-h-screen flex-1 pt-20">
        <Sidebar role={user.role} />
        <main className="flex-1">
          <div className="mx-auto w-19/20 py-8">
            <Outlet />
          </div>
          <Footer role={user.role} />
        </main>
      </div>
    </div>
  )
}