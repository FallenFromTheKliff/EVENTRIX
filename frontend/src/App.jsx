import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import { RouterProvider } from "react-router/dom";

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
import Cart from "./pages/Cart";

const router = createBrowserRouter(createRoutesFromElements(
  <>
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
          <Route path="/events/:slug" element={<EventView />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-event" element={<EventEditor />} />
          <Route path="/edit-event/:slug" element={<EventEditor />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>
      </Route>
    </Route>
  </>
));

function App() {
  return <RouterProvider router={router} />
}

export default App;