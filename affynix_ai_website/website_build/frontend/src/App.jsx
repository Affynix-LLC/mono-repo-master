import './App.css'
import Pages from "@/pages/Index.jsx";
import Contact from "@/pages/Contact.jsx";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pages />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;