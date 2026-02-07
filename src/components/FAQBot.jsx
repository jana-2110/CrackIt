import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { faqData } from '../data/faqData';

import { useAuth } from '../context/AuthContext';

const FAQBot = () => {
    const location = useLocation();
    const { currentUser } = useAuth(); // Get current user
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! How can I help you today?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Hide bot if not logged in OR if on Test pages
    if (!currentUser || location.pathname.startsWith('/test')) {
        return null;
    }

    const suggestions = ["How to start?", "Scoring Info", "Topics", "Leaderboard"];

    const processInput = (text) => {
        if (!text.trim()) return;

        const userMessage = { text: text, sender: "user" };
        setMessages(prev => [...prev, userMessage]);

        const lowerInput = text.toLowerCase();
        let botResponse = { text: "I'm not sure about that. Try asking about 'tests', 'scoring', or 'topics'.", sender: "bot" };

        const found = faqData.find(item =>
            item.keywords.some(keyword => lowerInput.includes(keyword))
        );

        if (found) {
            botResponse.text = found.answer;
        }

        setTimeout(() => {
            setMessages(prev => [...prev, botResponse]);
        }, 500);

        setInput("");
    };

    const handleSend = (e) => {
        e.preventDefault();
        processInput(input);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white dark:bg-slate-800 w-80 h-96 rounded-lg shadow-2xl mb-4 flex flex-col border border-gray-200 dark:border-slate-700 animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-brand-primary p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="text-white font-bold">Crack It Helper</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user'
                                    ? 'bg-brand-primary text-white rounded-br-none'
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-gray-100 dark:border-slate-700">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => processInput(s)}
                                className="text-xs bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-slate-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-1 p-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary bg-transparent dark:text-white"
                            />
                            <button type="submit" className="bg-brand-primary text-white p-2 rounded-md hover:bg-brand-secondary transition">
                                ➤
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-brand-primary hover:bg-brand-secondary text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
            >
                {isOpen ? (
                    <span className="text-xl font-bold">✕</span>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default FAQBot;
