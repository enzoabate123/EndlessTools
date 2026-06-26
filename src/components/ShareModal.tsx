import { X, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedCode: string;
}

export default function ShareModal({ isOpen, onClose, embedCode }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy to clipboard", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-2">Share & Embed</h2>
        <p className="text-sm text-gray-400 mb-6">
          Copy the code below to embed this 3D component on your website or application.
        </p>

        <div className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5 relative group">
          <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap break-all h-32 custom-scrollbar">
            {embedCode}
          </pre>

          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white p-2 rounded-lg transition flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
