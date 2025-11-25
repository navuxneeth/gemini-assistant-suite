import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message, Tone } from "../ChatInterface";
import { Camera, Upload } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  tone: Tone;
  setIsThinking: (value: boolean) => void;
};

const VisionModal = ({
  open,
  onClose,
  messages,
  setMessages,
  tone,
  setIsThinking,
}: Props) => {
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Camera access denied",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          processImage(blob);
        }
      }, "image/jpeg");
    }
    stopCamera();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = async (blob: Blob) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = (reader.result as string).split(",")[1];
      const dataUrl = reader.result as string;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: "Image for analysis",
        image: dataUrl,
      };

      setMessages(prev => [...prev, userMessage]);
      onClose();
      setIsThinking(true);

      try {
        const { data, error } = await supabase.functions.invoke("vision", {
          body: {
            image: base64Image,
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
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to analyze image",
          variant: "destructive",
        });
      } finally {
        setIsThinking(false);
      }
    };

    reader.readAsDataURL(blob);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vision Input</DialogTitle>
        </DialogHeader>

        {!showCamera ? (
          <div className="space-y-3">
            <Button onClick={startCamera} className="w-full gap-2">
              <Camera className="h-5 w-5" />
              Take Photo
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              className="w-full gap-2"
            >
              <Upload className="h-5 w-5" />
              Upload Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <video
              ref={videoRef}
              autoPlay
              className="w-full rounded-lg"
            />
            <div className="flex gap-2">
              <Button onClick={capturePhoto} className="flex-1">
                Capture
              </Button>
              <Button onClick={stopCamera} variant="secondary" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VisionModal;
