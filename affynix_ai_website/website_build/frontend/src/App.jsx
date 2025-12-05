import './App.css'
import Pages from "@/pages/Index.jsx";
import Contact from "@/pages/Contact.jsx";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OpenAIAssistant from "@/components/OpenAIAssistant.jsx";

function App() {
  const assistantId = import.meta.env.VITE_OPENAI_ASSISTANT_ID;
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pages />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Toaster />
      {assistantId && (
        <OpenAIAssistant
          assistantId={assistantId}
          title="Affynix Assistant"
          placeholder="Ask me about our AI agents..."
          welcomeMessage="Hello! I'm here to help you learn about Affynix AI agents. What would you like to know?"
        />
      )}
    </BrowserRouter>
  );
}

export default App;