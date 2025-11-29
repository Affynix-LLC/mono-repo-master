import React, { useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import { Mail, Phone, MessageSquare, Calendar } from "lucide-react";

export default function Contact() {
    const [formState, setFormState] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production hook into backend/email service. For now, show confirmation.
        setStatus("Thanks for reaching out. Agent01 will follow up shortly.");
        setFormState({ name: "", email: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <HeaderBar />
            <main className="pt-28 pb-16 px-4 sm:px-8 max-w-5xl mx-auto space-y-10">
                <section className="text-center space-y-4">
                    <p className="text-xs tracking-[0.6em] text-yellow-400 uppercase">Contact Affynix</p>
                    <h1 className="text-3xl sm:text-4xl font-light text-white">
                        We're here to help you launch faster.
                    </h1>
                    <p className="text-base text-gray-300 max-w-3xl mx-auto">
                        Use the form below, connect through your preferred channel, or book a Calendly session.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Mail, label: "Email", value: "contact@affynix.ai", href: "mailto:contact@affynix.ai" },
                        { icon: Phone, label: "Phone", value: "(555) 123-4567", href: "tel:+15551234567" },
                        { icon: MessageSquare, label: "Chat", value: "Speak with Agent01 on the home page", href: "/" },
                    ].map(({ icon: Icon, label, value, href }) => (
                        <a
                            key={label}
                            href={href}
                            className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur hover:border-yellow-400/40 transition"
                        >
                            <Icon className="w-6 h-6 text-yellow-300 mb-3" />
                            <p className="text-sm uppercase tracking-[0.35em] text-gray-400">{label}</p>
                            <p className="text-lg text-white mt-1">{value}</p>
                        </a>
                    ))}
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <form
                        onSubmit={handleSubmit}
                        className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur space-y-4"
                    >
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { label: "Name", name: "name", type: "text", placeholder: "Full name" },
                                { label: "Business Name", name: "business", type: "text", placeholder: "Company or project" },
                                { label: "Industry", name: "industry", type: "text", placeholder: "e.g. Fitness, SaaS, Real Estate" },
                                { label: "Website (if available)", name: "website", type: "url", placeholder: "https://yourdomain.com" },
                                { label: "Email", name: "email", type: "email", placeholder: "you@company.com", required: true },
                            ].map(({ label, name, type, placeholder, required }) => (
                                <div key={name}>
                                    <label className="text-sm uppercase tracking-[0.3em] text-gray-400">{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={formState[name] || ""}
                                        onChange={handleChange}
                                        required={required ?? false}
                                        className="mt-2 w-full rounded-2xl bg-black/70 border border-white/10 px-4 py-3 focus:border-yellow-400 outline-none transition"
                                        placeholder={placeholder}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="text-sm uppercase tracking-[0.3em] text-gray-400">Message</label>
                            <textarea
                                name="message"
                                value={formState.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="mt-2 w-full rounded-2xl bg-black/70 border border-white/10 px-4 py-3 focus:border-yellow-400 outline-none transition"
                                placeholder="What brought you here? Let us know anything about your business or interests here."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-medium shadow-[0_15px_50px_rgba(255,215,0,0.25)] transition hover:opacity-90"
                        >
                            Send Message
                        </button>
                        {status && <p className="text-sm text-yellow-300">{status}</p>}
                    </form>

                    <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur space-y-6">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Schedule</p>
                            <h2 className="text-2xl font-light text-white mt-2">Book a consultation with Affynix</h2>
                            <p className="text-gray-300 mt-2">
                                Choose a time that fits your calendar. Agent01 will confirm details instantly.
                            </p>
                            <a
                                href="https://calendly.com/affynix"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-4 px-5 py-3 rounded-2xl border border-yellow-400/50 text-yellow-300 hover:bg-yellow-300/10 transition"
                            >
                                <Calendar className="w-4 h-4" />
                                Open Calendly
                            </a>
                        </div>
                        <div className="p-4 rounded-2xl border border-white/10 bg-black/60">
                            <p className="text-sm text-gray-400">Response time</p>
                            <p className="text-lg text-white">We typically respond within 1 business day.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

