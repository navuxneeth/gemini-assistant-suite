import { useState, useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";
import WelcomeModal from "@/components/modals/WelcomeModal";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
  };

  return (
    <>
      <ChatInterface />
      <WelcomeModal open={showWelcome} onClose={handleCloseWelcome} />
    </>
  );
};

export default Index;
