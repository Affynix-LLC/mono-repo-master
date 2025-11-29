import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Calculator } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Agents", href: "/#agents" },
    { name: "Leads", href: "/Pricing" },
    { name: "Calculator", href: "/Calculator" },
    { name: "Consulting", href: "/Consulting" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-black/95 backdrop-blur-xl shadow-lg" 
          : "bg-black/80 backdrop-blur-md"
      }`}
      style={{ borderBottom: scrolled ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid rgba(212, 175, 55, 0.1)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <div className="text-3xl font-bold text-[#D4AF37] hover:text-[#E6C878] transition-colors">
              Affynix
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white font-medium transition-colors flex items-center gap-2"
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}
            <a href="#contact">
              <Button className="bg-[#D4AF37] hover:bg-[#E6C878] text-black px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                Book Demo
              </Button>
            </a>
          </div>

          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-[#D4AF37]/20">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-white font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-gray-300 hover:text-white font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            ))}
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-[#D4AF37] hover:bg-[#E6C878] text-black px-6 py-2 rounded-full font-semibold">
                Book Demo
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}