import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminDashboard from './pages/AdminDashboard';
import ClientManager from './pages/ClientManager';
import AgentManager from './pages/AgentManager';
import Payments from './pages/Payments';
import IntakeViewer from './pages/IntakeViewer';
import AIEditor from './pages/AIEditor';
import Settings from './pages/Settings';
import PasswordGate from './components/PasswordGate';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <PasswordGate>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/clients" element={<ClientManager />} />
          <Route path="/agents" element={<AgentManager />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/intakes" element={<IntakeViewer />} />
          <Route path="/ai-editor" element={<AIEditor />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    </PasswordGate>
  );
}

export default App;
