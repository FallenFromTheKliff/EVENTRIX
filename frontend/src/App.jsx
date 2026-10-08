import { BrowserRouter, Routes, Route } from "react-router";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";

function App() {

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-col">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App