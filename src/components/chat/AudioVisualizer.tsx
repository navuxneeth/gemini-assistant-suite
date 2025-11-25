const AudioVisualizer = () => {
  return (
    <div className="my-2 flex h-10 items-center justify-center gap-1">
      <div
        className="w-1 animate-wave rounded-full bg-primary"
        style={{ animationDelay: "0.1s", height: "100%" }}
      />
      <div
        className="w-1 animate-wave rounded-full bg-primary"
        style={{ animationDelay: "0.3s", height: "100%" }}
      />
      <div
        className="w-1 animate-wave rounded-full bg-primary"
        style={{ animationDelay: "0.2s", height: "100%" }}
      />
    </div>
  );
};

export default AudioVisualizer;
