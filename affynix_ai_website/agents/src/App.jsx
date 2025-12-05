import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import OpenAIAssistant from "@/components/OpenAIAssistant.jsx"

function App() {
  const assistantId = import.meta.env.VITE_OPENAI_ASSISTANT_ID;
  
  return (
    <>
      <Pages />
      <Toaster />
      {assistantId && (
        <OpenAIAssistant
          assistantId={assistantId}
          title="Affynix Assistant"
          placeholder="Ask me about our AI agents..."
          welcomeMessage="Hello! I'm here to help you learn about Affynix AI agents and automation solutions. What would you like to know?"
        />
      )}
    </>
  )
}

export default App 