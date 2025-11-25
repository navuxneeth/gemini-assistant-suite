import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tone } from "../ChatInterface";

type Props = {
  open: boolean;
  onClose: () => void;
  currentTone: Tone;
  onSelectTone: (tone: Tone) => void;
};

const tones: Array<{
  value: Tone;
  emoji: string;
  label: string;
  description: string;
}> = [
  {
    value: "friendly",
    emoji: "😊",
    label: "Friendly",
    description: "Casual, warm, and approachable",
  },
  {
    value: "professional",
    emoji: "👔",
    label: "Professional",
    description: "Formal, structured, and precise",
  },
  {
    value: "creative",
    emoji: "🎨",
    label: "Creative",
    description: "Imaginative, witty, and expressive",
  },
  {
    value: "concise",
    emoji: "⚡️",
    label: "Concise",
    description: "Direct, brief, and to-the-point",
  },
];

const ToneModal = ({ open, onClose, currentTone, onSelectTone }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a Tone</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {tones.map((tone) => (
            <button
              key={tone.value}
              onClick={() => {
                onSelectTone(tone.value);
                onClose();
              }}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all ${
                currentTone === tone.value
                  ? "border-primary bg-accent"
                  : "border-transparent bg-muted hover:bg-accent"
              }`}
            >
              <span className="text-3xl">{tone.emoji}</span>
              <span className="font-medium">{tone.label}</span>
              <span className="text-xs text-muted-foreground">
                {tone.description}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToneModal;
