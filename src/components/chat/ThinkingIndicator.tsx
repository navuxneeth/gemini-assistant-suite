const ThinkingIndicator = () => {
  return (
    <div className="self-start rounded-2xl rounded-bl bg-assistant-bubble px-4 py-3">
      <div className="flex gap-1">
        <div
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
          style={{ animationDelay: "200ms" }}
        />
        <div
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
          style={{ animationDelay: "400ms" }}
        />
      </div>
    </div>
  );
};

export default ThinkingIndicator;
