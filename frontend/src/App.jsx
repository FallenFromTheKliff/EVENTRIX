import { BrowserRouter, Routes, Route } from "react-router";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import SupportFAQs from "./pages/SupportFAQs";
import Dashboard from "./pages/admin/Dashboard";
import Events from "./pages/Events";
import EventView from "./pages/EventView";
import EventEditor from "./pages/admin/EventEditor";
import Bookings from "./pages/Bookings";
import Transactions from "./pages/admin/Transactions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/events" element={<Events />} />
            <Route path="/support" element={<SupportFAQs />} />
            <Route element={<ProtectedRoute roles={["USER"]} />}>
              <Route path="/home" element={<Home />} />
              <Route path="/events/:id" element={<EventView />} />
              <Route path="/bookings" element={<Bookings />} />
            </Route>
            <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-event" element={<EventEditor />} />
              <Route path="/edit-event/:id" element={<EventEditor />} />
              <Route path="/transactions" element={<Transactions />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;