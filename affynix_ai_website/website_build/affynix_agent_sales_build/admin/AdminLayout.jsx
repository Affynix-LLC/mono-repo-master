import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Bot, 
  DollarSign, 
  FileText, 
  Sparkles, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children, user }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: createPageUrl("AdminDashboard"), icon: LayoutDashboard },
    { name: "Clients", path: createPageUrl("ClientManager"), icon: Users },
    { name: "Agents", path: createPageUrl("AgentManager"), icon: Bot },
    { name: "Payments", path: createPageUrl("Payments"), icon: DollarSign },
    { name: "Intakes", path: createPageUrl("IntakeViewer"), icon: FileText },
    { name: "AI Editor", path: createPageUrl("AIEditor"), icon: Sparkles },
    { name: "Settings", path: createPageUrl("Settings"), icon: Settings },
  ];

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname === path + '.jsx';

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#111111]/95 border-b border-[#C6A45E]/20">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-[#C6A45E]">
                Affynix
              </div>
              <div className="text-sm text-gray-500 hidden sm:block">
                / Admin Portal
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`text-gray-300 hover:text-[#12F4FF] hover:bg-[#12F4FF]/10 transition-all duration-200 ${
                      isActive(item.path) 
                        ? 'text-[#12F4FF] bg-[#12F4FF]/10 border-b-2 border-[#12F4FF] rounded-b-none' 
                        : ''
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>

            {/* User Info & Logout */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {user?.full_name || user?.email}
                </div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-300 hover:text-[#12F4FF]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden backdrop-blur-xl bg-[#111111]/95 border-t border-[#C6A45E]/20">
            <div className="px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-gray-300 hover:text-[#12F4FF] hover:bg-[#12F4FF]/10 ${
                      isActive(item.path) ? 'text-[#12F4FF] bg-[#12F4FF]/10' : ''
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              ))}
              <div className="pt-4 border-t border-[#C6A45E]/20">
                <div className="text-sm text-white mb-2">
                  {user?.full_name || user?.email}
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}