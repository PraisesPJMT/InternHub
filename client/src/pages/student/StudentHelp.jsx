import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
// import { Button } from "@/components/ui/button";

// Mock API to simulate agent response
const mockAgentResponse = async (userMessage) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Simple canned responses
  const responses = [
    "Hello! How can I assist you today?",
    "Got it! Let me check that for you.",
    "Thanks for the update. Anything else?",
    "I see. Can you clarify a bit more?",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const StudentHelp = () => {
  const [messages, setMessages] = useState([
    { id: 0, sender: "agent", text: "Hi! I'm your assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);
    scrollToBottom();

    // Simulate agent response
    const agentText = await mockAgentResponse(input);
    const agentMsg = { id: Date.now() + 1, sender: "agent", text: agentText };
    setMessages((prev) => [...prev, agentMsg]);
    setIsSending(false);
    scrollToBottom();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[500px] md:h-[600px] w-full p-4">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg shadow ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-12"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        <Button
          onClick={sendMessage}
          disabled={isSending || !input.trim()}
          className="px-4 py-2 flex items-center justify-center"
        >
          <Icon icon="mdi:send" width={24} height={24} />
        </Button>
      </div>
    </Card>
  );
};

export default StudentHelp;