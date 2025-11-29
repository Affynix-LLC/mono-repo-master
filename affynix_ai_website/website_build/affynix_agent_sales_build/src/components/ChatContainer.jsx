import React, { useEffect, useRef } from "react";
import MessageList from "./MessageList";
import InputBar from "./InputBar";
import LoadingIndicator from "./LoadingIndicator";

export default function ChatContainer({ 
    messages, 
    onSendMessage, 
    isAgentTyping = false 
}) {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isAgentTyping]);

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto px-4 pb-6">
            {/* Messages Container */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-y-auto mb-6 px-2"
                style={{ maxHeight: 'calc(100vh - 400px)' }}
            >
                {messages.length > 0 ? (
                    <>
                        <MessageList messages={messages} />
                        {isAgentTyping && (
                            <div className="mb-4">
                                <LoadingIndicator />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-600 text-sm font-light">
                            Start the conversation...
                        </p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="sticky bottom-0">
                <InputBar 
                    onSendMessage={onSendMessage} 
                    disabled={isAgentTyping}
                />
            </div>
        </div>
    );
}