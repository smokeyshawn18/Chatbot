import { useState, useRef, useEffect } from "react";
import axios from "axios";
import type { Message } from "../components/Chatbot/types";

export const useChatbot = (username: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll chat to bottom on new messages or loading changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add to user messages
    const userMessage: Message = { text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    // Add to search history if not duplicate and not empty
    setHistory((prev) => {
      if (text.trim() && !prev.includes(text.trim())) {
        return [text.trim(), ...prev].slice(0, 10); // keep max 10 items
      }
      return prev;
    });

    setIsLoading(true);

    try {
      const response = await axios.post<{ reply: string }>(
        "https://mcityxai.onrender.com/api/chat",
        { message: text, username }
      );
      const botMessage: Message = { text: response.data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMsg: Message = {
        text: "Sorry, there was a problem connecting to the server.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Optionally, allow clicking history item to re-send
  const resendFromHistory = (text: string) => {
    sendMessage(text);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    messagesEndRef,
    history,
    resendFromHistory,
  };
};
