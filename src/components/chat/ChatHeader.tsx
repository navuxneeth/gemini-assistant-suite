import { Tone } from "../ChatInterface";
import cometLogo from "@/assets/comet-logo.jpg";
import { Volume2, VolumeX } from "lucide-react";

type Props = {
  onNewChat: () => void;
  onShowSettings: () => void;
  onShowTone: () => void;
  tone: Tone;
  onSpeakLastMessage: () => void;
  isSpeakingLastMessage: boolean;
};

const toneEmojis: Record<Tone, string> = {
  friendly: "😊",
  professional: "👔",
  creative: "🎨",
  concise: "⚡️",
};

const ChatHeader = ({
  onNewChat,
  onShowSettings,
  onShowTone,
  tone,
  onSpeakLastMessage,
  isSpeakingLastMessage,
}: Props) => {
  return (
    <header className="flex h-16 items-center justify-between border-b px-5">
      <div className="flex items-center gap-3">
        <img src={cometLogo} alt="Comet Logo" className="h-8 w-8 rounded-full object-cover" />
        <h1 className="text-lg font-semibold">Comet</h1>
      </div>
      <div className="flex gap-4 text-xl text-muted-foreground">
        <button
          onClick={onNewChat}
          className="transition-colors hover:text-primary"
          aria-label="New chat"
        >
          ＋
        </button>
        <button
          onClick={onShowTone}
          className="transition-colors hover:text-primary"
          aria-label="Change tone"
        >
          {toneEmojis[tone]}
        </button>
        <button
          onClick={onSpeakLastMessage}
          className="text-sm transition-colors hover:text-primary"
          aria-label={isSpeakingLastMessage ? "Stop speaking" : "Speak last message"}
        >
          {isSpeakingLastMessage ? (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Volume2 className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        <button
          onClick={onShowSettings}
          className="transition-colors hover:text-primary"
          aria-label="Settings"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
