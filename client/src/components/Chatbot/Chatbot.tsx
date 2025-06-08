import { useState, type ChangeEvent } from "react";
import { useChatbot } from "../../hooks/useChatbot";

import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import Logo from "../../assets/logo.png";

import ChatMessages from "./ChatMessage";

const Chatbot = () => {
  const username = "student1";
  const { messages, isLoading, sendMessage, messagesEndRef } =
    useChatbot(username);
  const [input, setInput] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#6CABDD] to-[#031F4C] p-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full max-w-7xl h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Chat Section */}
        <section className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header
            className="flex items-center gap-4 px-6 py-5 bg-[#031F4C] text-white"
            aria-label="Chatbot header"
          >
            <img
              src={Logo}
              alt="McityX AI Chatbot Logo"
              className="w-12 h-12 rounded-full shadow-lg border-2 border-white"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold leading-tight">
                McityX AI Chatbot
              </h1>
              <p className="text-sm font-light text-slate-200">
                Powered by smokeyshawn18
              </p>
            </div>
          </header>

          {/* Messages */}
          <main
            className="flex-1 px-6 py-4 overflow-y-auto bg-[#f9fafb] flex flex-col"
            aria-live="polite"
            aria-atomic="true"
          >
            <ChatMessages messages={messages} />
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </main>

          {/* Input */}
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onSend={handleSend}
            disabled={isLoading}
          />
        </section>

        {/* Search History Sidebar */}
      </div>
    </div>
  );
};

export default Chatbot;
