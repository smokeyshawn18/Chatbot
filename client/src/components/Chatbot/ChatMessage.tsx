import { motion, AnimatePresence } from "framer-motion";
import type { Message } from "./types";

interface ChatMessagesProps {
  messages: Message[];
}

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const ChatMessages = ({ messages }: ChatMessagesProps) => (
  <AnimatePresence initial={false}>
    {messages.map((msg, idx) => (
      <motion.div
        key={idx}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={messageVariants}
        transition={{ duration: 0.3, delay: idx * 0.05 }}
        className={`max-w-[70%] mb-4 p-4 rounded-2xl break-words whitespace-pre-wrap shadow-md ${
          msg.sender === "user"
            ? "bg-[#4f8dc0] text-white self-end rounded-br-none"
            : "bg-[#031F4C] text-white self-start rounded-bl-none"
        }`}
        role="article"
        aria-label={`${msg.sender === "user" ? "User" : "Bot"} message`}
      >
        {msg.text}
      </motion.div>
    ))}
  </AnimatePresence>
);

export default ChatMessages;
