import React from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages }) {
    return (
        <div className="flex flex-col w-full">
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    sender={message.sender}
                    text={message.text}
                    timestamp={message.timestamp}
                />
            ))}
        </div>
    );
}