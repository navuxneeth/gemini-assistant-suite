import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message, Tone } from "../ChatInterface";
import { Mic, Paperclip } from "lucide-react";

type Props = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  tone: Tone;
  setIsThinking: (value: boolean) => void;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  onShowVision: () => void;
  setIsSpeaking: (value: boolean) => void;
};

const ChatInput = ({
  messages,
  setMessages,
  tone,
  setIsThinking,
  isListening,
  setIsListening,
  onShowVision,
  setIsSpeaking,
}: Props) => {
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const inputTextRef = useRef("");

  const handleSend = async (voiceMode = false) => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [...messages, userMessage],
          tone,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If voice input was used, speak the response
      if (voiceMode) {
        speakText(data.response);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsThinking(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = async () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      // Use browser's Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        toast({
          title: "Not supported",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive",
        });
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        inputTextRef.current = transcript;
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Recognition failed",
          description: "Please try again or type your message.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto-send when speech recognition ends
        if (inputTextRef.current.trim()) {
          handleSend(true);
          inputTextRef.current = "";
        }
      };

      recognition.start();
    } catch (error) {
      console.error("Speech recognition error:", error);
      toast({
        title: "Speech recognition failed",
        description: "Please try typing your message instead.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-3 border-t p-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend(false)}
        placeholder="Ask anything..."
        className="flex-1 rounded-full border-none bg-input px-4 py-3 text-sm outline-none"
      />
      <button
        onClick={onShowVision}
        className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary text-2xl font-light text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        aria-label="Attach image"
      >
        <Paperclip className="h-5 w-5" />
      </button>
      <button
        onClick={handleVoiceInput}
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-primary text-xl text-primary-foreground transition-all hover:bg-primary/90 ${
          isListening ? "animate-pulse-ring" : ""
        }`}
        aria-label={isListening ? "Stop recording" : "Start recording"}
      >
        <Mic className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ChatInput;
