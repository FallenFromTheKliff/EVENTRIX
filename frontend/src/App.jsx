import { BrowserRouter, Routes, Route } from "react-router";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import SupportFAQs from "./pages/SupportFAQs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/events" element={<Events />} />
            <Route path="/support" element={<SupportFAQs />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;