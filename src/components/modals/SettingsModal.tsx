import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onClearHistory: () => void;
  onToggleTheme: () => void;
  theme: "light" | "dark";
};

const SettingsModal = ({ open, onClose, onClearHistory, onToggleTheme, theme }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription className="text-center text-foreground">
            Powered by Web Speech API and Gemini
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground text-center space-y-1">
            <p>Made by Navaneeth, Aditi, Anarva, Krishna</p>
            <p>of MIT Institute of Design | 2025</p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <p>Mentored under <span className="text-blue-600">Prof. Aryan Halkude</span></p>
              <button
                onClick={() => window.open('https://www.linkedin.com/in/aryan-halkude', '_blank')}
                className="inline-flex items-center justify-center gap-1 text-blue-600 border border-blue-600 rounded px-2 py-1 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-3 w-3" />
                <span className="text-xs">LinkedIn</span>
              </button>
            </div>
          </div>
          <Button
            onClick={() => window.open('https://github.com/navuxneeth', '_blank')}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            View Github Repository
          </Button>
          <Button
            onClick={onToggleTheme}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            {theme === "dark" ? "Dark Mode" : "Light Mode"}
          </Button>
          <Button
            onClick={onClearHistory}
            variant="destructive"
            className="w-full"
          >
            Clear History
          </Button>
          <Button onClick={onClose} variant="secondary" className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
