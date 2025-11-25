import { useState } from "react";
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
  setIsPlayingAudio: (value: boolean) => void;
  onShowVision: () => void;
};

const ChatInput = ({
  messages,
  setMessages,
  tone,
  setIsThinking,
  isListening,
  setIsListening,
  setIsPlayingAudio,
  onShowVision,
}: Props) => {
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleSend = async () => {
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

      // Play audio response
      if (data.audio) {
        setIsPlayingAudio(true);
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.onended = () => setIsPlayingAudio(false);
        audio.play();
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

  const handleVoiceInput = async () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(",")[1];
          
          try {
            const { data, error } = await supabase.functions.invoke("speech-to-text", {
              body: { audio: base64Audio },
            });

            if (error) throw error;
            setInput(data.text);
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to transcribe audio",
              variant: "destructive",
            });
          }
        };
        
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      setIsListening(true);
      mediaRecorder.start();

      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          setIsListening(false);
        }
      }, 5000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Microphone access denied",
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
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
