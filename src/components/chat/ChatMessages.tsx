import { useEffect, useRef } from "react";
import { Message } from "../ChatInterface";
import MessageBubble from "./MessageBubble";
import ThinkingIndicator from "./ThinkingIndicator";
import AudioVisualizer from "./AudioVisualizer";

type Props = {
  messages: Message[];
  isThinking: boolean;
  isPlayingAudio: boolean;
};

const ChatMessages = ({ messages, isThinking, isPlayingAudio }: Props) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    <main className="flex-1 overflow-y-auto bg-[linear-gradient(rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:40px_40px] p-4">
      {messages.length === 0 && !isThinking && (
        <div className="flex h-full items-center justify-center text-6xl opacity-20">
          🌐
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isThinking && <ThinkingIndicator />}
        {isPlayingAudio && <AudioVisualizer />}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};

export default ChatMessages;
