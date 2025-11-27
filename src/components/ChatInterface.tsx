import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import ChatHeader from "./chat/ChatHeader";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";
import VoiceWave from "./chat/VoiceWave";
import SettingsModal from "./modals/SettingsModal";
import ToneModal from "./modals/ToneModal";
import VisionModal from "./modals/VisionModal";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
};

export type Tone = "friendly" | "professional" | "creative" | "concise";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [tone, setTone] = useState<Tone>(() => {
    return (localStorage.getItem("tone") as Tone) || "friendly";
  });
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showTone, setShowTone] = useState(false);
  const [showVision, setShowVision] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakingLastMessage, setIsSpeakingLastMessage] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("tone", tone);
  }, [tone]);

  const handleNewChat = () => {
    setMessages([]);
    toast({ title: "New chat started" });
  };

  const handleClearHistory = () => {
    setMessages([]);
    setShowSettings(false);
    toast({ title: "Chat history cleared" });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleSpeakLastMessage = () => {
    if (isSpeakingLastMessage) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeakingLastMessage(false);
      return;
    }

    // Find the last assistant message
    const lastAssistantMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "assistant");

    if (!lastAssistantMessage) {
      toast({
        title: "No message to speak",
        description: "There are no assistant messages to read aloud.",
      });
      return;
    }

    if ('speechSynthesis' in window) {
      setIsSpeakingLastMessage(true);
      const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.content);
      utteranceRef.current = utterance;
      
      utterance.onend = () => {
        setIsSpeakingLastMessage(false);
        utteranceRef.current = null;
      };
      
      utterance.onerror = () => {
        setIsSpeakingLastMessage(false);
        utteranceRef.current = null;
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-primary-light/20 to-background p-4">
      <div className="flex h-[95vh] max-h-[750px] w-full max-w-md flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl">
      <ChatHeader
        onNewChat={handleNewChat}
        onShowSettings={() => setShowSettings(true)}
        onShowTone={() => setShowTone(true)}
        tone={tone}
        onSpeakLastMessage={handleSpeakLastMessage}
        isSpeakingLastMessage={isSpeakingLastMessage}
      />
        
        <ChatMessages
          messages={messages}
          isThinking={isThinking}
        />
        
        {isSpeaking && <VoiceWave />}
        
        <ChatInput
          messages={messages}
          setMessages={setMessages}
          tone={tone}
          setIsThinking={setIsThinking}
          isListening={isListening}
          setIsListening={setIsListening}
          onShowVision={() => setShowVision(true)}
          setIsSpeaking={setIsSpeaking}
        />
      </div>

      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onClearHistory={handleClearHistory}
        onToggleTheme={toggleTheme}
        theme={theme}
      />
      
      <ToneModal
        open={showTone}
        onClose={() => setShowTone(false)}
        currentTone={tone}
        onSelectTone={setTone}
      />
      
      <VisionModal
        open={showVision}
        onClose={() => setShowVision(false)}
        messages={messages}
        setMessages={setMessages}
        tone={tone}
        setIsThinking={setIsThinking}
      />
    </div>
  );
};

export default ChatInterface;
