import { useState, type ChangeEvent } from "react";
import { Home } from "lucide-react";
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

  const handleGoHome = () => {
    // Add your navigation logic here
    window.location.href = "https://mcityx.vercel.app"; // Replace with your homepage URL
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#6CABDD] via-[#4A90B8] to-[#031F4C] p-2 sm:p-4 lg:p-6"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full max-w-7xl mx-auto h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] lg:h-[85vh] bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20">
        {/* Chat Section */}
        <section className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header
            className="flex items-center sticky  top-0 justify-between px-3 sm:px-6 py-3 sm:py-5 bg-gradient-to-r from-[#031F4C] to-[#1a3d5c] text-white  overflow-hidden"
            aria-label="Chatbot header"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50"></div>

            {/* Left side - Logo and title */}
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="relative">
                <img
                  src={Logo}
                  alt="McityX AI Chatbot Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg border-2 border-white/80 hover:border-white transition-all duration-300"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-2xl font-bold leading-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  McityX AI
                </h1>
                <p className="text-xs sm:text-sm font-light text-slate-300 hidden sm:block">
                  Powered by smokeyshawn18
                </p>
                <p className="text-xs font-light text-slate-300 sm:hidden">
                  AI Assistant
                </p>
              </div>
            </div>

            {/* Right side - Home button */}
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 group relative z-10"
              aria-label="Go to homepage"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-medium text-white hidden sm:inline">
                Go To Homepage
              </span>
              <span className="text-xs font-medium text-white sm:hidden">
                Go To Homepage
              </span>
            </button>
          </header>

          {/* Messages */}
          <main
            className="flex-1 px-3 sm:px-6 py-3 sm:py-4 overflow-y-auto bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] flex flex-col relative"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,#6CABDD_1px,transparent_1px)] bg-[length:20px_20px]"></div>

            <div className="relative z-10 flex flex-col h-full">
              <ChatMessages messages={messages} />
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* Input */}
          <div className="px-3 sm:px-6 pb-3 sm:pb-4 bg-gradient-to-t from-white to-transparent">
            <ChatInput
              value={input}
              onChange={handleInputChange}
              onSend={handleSend}
              disabled={isLoading}
            />
          </div>
        </section>
      </div>

      {/* Bottom disclaimer */}
      <div className="mt-4 px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-sky-800 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30 shadow-lg">
            <p className="text-center text-sm text-white leading-relaxed">
              <span className="inline-block mr-2">⚡</span>
              <strong>Please note:</strong> Responses may take a moment to
              generate.
              <br className="sm:hidden" />
              <span className="sm:ml-1">
                We appreciate your patience as we provide the best possible
                answers.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-specific floating elements */}
      <div className="fixed bottom-4 right-4 sm:hidden">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
      </div>
    </div>
  );
};

export default Chatbot;
