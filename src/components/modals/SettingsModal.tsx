import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  onClearHistory: () => void;
};

const SettingsModal = ({ open, onClose, onClearHistory }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Powered by Gemini and Web Speech API
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground text-center py-2">
            <p>Made by Navaneeth, Aditi, Anarva, Krishna</p>
          </div>
          <Button
            onClick={() => window.open('https://github.com/navuxneeth', '_blank')}
            variant="outline"
            className="w-full"
          >
            Access Github
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
