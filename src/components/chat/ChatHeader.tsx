import { Tone } from "../ChatInterface";

type Props = {
  onNewChat: () => void;
  onToggleTheme: () => void;
  onShowSettings: () => void;
  onShowTone: () => void;
  theme: "light" | "dark";
  tone: Tone;
};

const toneEmojis: Record<Tone, string> = {
  friendly: "😊",
  professional: "👔",
  creative: "🎨",
  concise: "⚡️",
};

const ChatHeader = ({
  onNewChat,
  onToggleTheme,
  onShowSettings,
  onShowTone,
  theme,
  tone,
}: Props) => {
  return (
    <header className="flex h-16 items-center justify-between border-b px-5">
      <h1 className="text-lg font-semibold">AI Assistant</h1>
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
          onClick={onToggleTheme}
          className="transition-colors hover:text-primary"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "🌙" : "☀️"}
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
