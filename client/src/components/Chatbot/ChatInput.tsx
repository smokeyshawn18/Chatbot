import type { ChangeEvent, FormEvent } from "./types";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  disabled: boolean;
}

const ChatInput = ({ value, onChange, onSend, disabled }: ChatInputProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-4 p-4 rounded-2xl bg-[#ffffff] "
      aria-label="Send message form"
    >
      <div className="flex-1">
        <label htmlFor="message-box" className="sr-only">
          Type your message
        </label>
        <textarea
          id="message-box"
          value={value}
          onChange={onChange}
          placeholder="Ask me anything about Man City..."
          rows={3}
          className="w-full resize-none rounded-xl border border-[#6CABDD] px-4 py-3 text-[#1e2a38] placeholder-[#3a5e7e] bg-white focus:outline-none focus:ring-2 focus:ring-[#6CABDD] focus:border-transparent transition shadow-sm"
          disabled={disabled}
          aria-disabled={disabled}
          aria-label="Type your message"
          autoFocus
        />
      </div>

      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="rounded-full bg-[#6CABDD] p-3 text-white hover:bg-[#5ba2d5] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-md"
        aria-label="Send message"
      >
        <Send size={24} />
      </button>
    </form>
  );
};

export default ChatInput;
