import { Message } from "../ChatInterface";

type Props = {
  message: Message;
};

const MessageBubble = ({ message }: Props) => {
  return (
    <div
      className={`animate-slide-in max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
        message.role === "user"
          ? "self-end rounded-br bg-user-bubble text-foreground"
          : "self-start rounded-bl bg-assistant-bubble text-foreground"
      }`}
    >
      {message.image && (
        <img
          src={message.image}
          alt="User uploaded"
          className="mb-2 max-w-full rounded-lg"
        />
      )}
      <p className="whitespace-pre-wrap">{message.content}</p>
    </div>
  );
};

export default MessageBubble;
