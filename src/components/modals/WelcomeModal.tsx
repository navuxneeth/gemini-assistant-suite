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
};

const WelcomeModal = ({ open, onClose }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to AI Assistant</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>Powered by Web Speech API and Gemini.</p>
            <p>Chat with text, images, and voice to get intelligent responses.</p>
          </DialogDescription>
        </DialogHeader>
        <Button onClick={onClose} className="w-full">
          Get Started
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
