import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const footerLinks = [
    { name: "Terms", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Contact", href: "#contact" },
    { name: "Careers", href: "#" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative bg-[#0E0E0E] border-t border-[#D4AF37]/20 py-12"
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-[#D4AF37] mb-3">
              Affynix
            </div>
            <p className="text-gray-400 text-sm">
              Automation Consultancy and Implementation Infrastructure
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-[#00FFFF] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#00FFFF] transition-colors">Careers</a></li>
              <li><a href="#contact" className="hover:text-[#00FFFF] transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">Solutions</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#solution" className="hover:text-[#00FFFF] transition-colors">Full Infrastructure</a></li>
              <li><a href="#single-agents" className="hover:text-[#00FFFF] transition-colors">Single Agents</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">Legal</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-[#00FFFF] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#00FFFF] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#D4AF37]/20 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2025 Affynix. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}