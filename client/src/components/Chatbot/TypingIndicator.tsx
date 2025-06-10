import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center gap-2 max-w-[30%] p-3 bg-[#031F4C] text-white rounded-2xl rounded-bl-none shadow-md"
    aria-live="polite"
    aria-label="Bot is typing"
  >
    <Loader2 className="animate-spin w-5 h-5" />
    <span>McITyX is thinking...</span>
  </motion.div>
);

export default TypingIndicator;
