import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export default function Checkout() {
    const [loading, setLoading] = useState(null);

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => api.entities.Product.filter({ active: true }),
        initialData: [],
    });

    const handleCheckout = async (priceId) => {
        setLoading(priceId);
        try {
            const response = await api.functions.invoke('createCheckout', { priceId });
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-4 affynix-header">
                    Choose Your Plan
                </h1>
                <p className="text-center text-gray-400 mb-12">
                    Select the perfect solution for your business needs
                </p>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-gray-900/60 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-cyan-400/50 transition-all"
                                style={{
                                    boxShadow: '0 4px 20px rgba(6, 182, 212, 0.1)'
                                }}
                            >
                                <h3 className="text-2xl font-bold mb-2 text-cyan-300">
                                    {product.name}
                                </h3>
                                <p className="text-gray-400 mb-6 min-h-[60px]">
                                    {product.description}
                                </p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-white">
                                        {product.displayPrice}
                                    </span>
                                    {product.type === "subscription" && (
                                        <span className="text-gray-400 ml-2">/month</span>
                                    )}
                                </div>
                                <Button
                                    onClick={() => handleCheckout(product.stripePriceId)}
                                    disabled={loading === product.stripePriceId}
                                    className="w-full bg-gradient-to-br from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 transition-all py-6 text-lg"
                                >
                                    {loading === product.stripePriceId ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5 mr-2" />
                                            Get Started
                                        </>
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}