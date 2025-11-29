import Layout from "./Layout.jsx";

import Home from "./Home";

import AdminDashboard from "./AdminDashboard";

import ClientManager from "./ClientManager";

import AgentManager from "./AgentManager";

import Payments from "./Payments";

import IntakeViewer from "./IntakeViewer";

import AIEditor from "./AIEditor";

import Settings from "./Settings";

import AgentControl from "./AgentControl";

import Onboarding from "./Onboarding";

import Pricing from "./Pricing";

import PaymentSuccess from "./PaymentSuccess";

import PaymentCancel from "./PaymentCancel";

import OnboardingQuestionnaire from "./OnboardingQuestionnaire";

import Agents from "./Agents";

import ClientPortal from "./ClientPortal";

import TestimonialsManager from "./TestimonialsManager";

import Calculator from "./Calculator";

import Consulting from "./Consulting";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    AdminDashboard: AdminDashboard,
    
    ClientManager: ClientManager,
    
    AgentManager: AgentManager,
    
    Payments: Payments,
    
    IntakeViewer: IntakeViewer,
    
    AIEditor: AIEditor,
    
    Settings: Settings,
    
    AgentControl: AgentControl,
    
    Onboarding: Onboarding,
    
    Pricing: Pricing,
    
    PaymentSuccess: PaymentSuccess,
    
    PaymentCancel: PaymentCancel,
    
    OnboardingQuestionnaire: OnboardingQuestionnaire,
    
    Agents: Agents,
    
    ClientPortal: ClientPortal,
    
    TestimonialsManager: TestimonialsManager,
    
    Calculator: Calculator,
    
    Consulting: Consulting,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/ClientManager" element={<ClientManager />} />
                
                <Route path="/AgentManager" element={<AgentManager />} />
                
                <Route path="/Payments" element={<Payments />} />
                
                <Route path="/IntakeViewer" element={<IntakeViewer />} />
                
                <Route path="/AIEditor" element={<AIEditor />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/AgentControl" element={<AgentControl />} />
                
                <Route path="/Onboarding" element={<Onboarding />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
                
                <Route path="/PaymentCancel" element={<PaymentCancel />} />
                
                <Route path="/OnboardingQuestionnaire" element={<OnboardingQuestionnaire />} />
                
                <Route path="/Agents" element={<Agents />} />
                
                <Route path="/ClientPortal" element={<ClientPortal />} />
                
                <Route path="/TestimonialsManager" element={<TestimonialsManager />} />
                
                <Route path="/Calculator" element={<Calculator />} />
                
                <Route path="/Consulting" element={<Consulting />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}