"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Cpu, Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(50);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add initial message and fetch user credits
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "SYSTEM INITIALIZED. L.U.C.I. AI READY. How can I assist with your sports predictions today, user123?",
      },
    ]);

    // Fetch initial credits
    async function fetchCredits() {
      try {
        const response = await fetch("/api/user/credits", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.credits !== undefined) {
            setCredits(data.credits);
          }
        }
      } catch (err) {
        console.error("Failed to fetch credits:", err);
      }
    }

    fetchCredits();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setIsLoading(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);

      // Update credits if available
      if (data.credits !== undefined) {
        setCredits(data.credits);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-cyan-900/30 bg-gray-800/50">
        <Cpu size={16} className="text-cyan-500 ml-2" />
        <h2 className="font-mono text-sm text-white">
          /// PREDICTIVE ANALYSIS CHAT
        </h2>
        <div className="ml-auto text-xs px-2 py-1 bg-gray-900 border border-cyan-900 text-cyan-400 font-mono mr-2">
          {credits} CREDITS
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-3 mb-3 pr-2 bg-gray-200/90">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 text-sm ${
              message.role === "assistant"
                ? "bg-gray-300 border-l-4 border-cyan-500 text-black"
                : "bg-gray-300 border-r-4 border-gray-500 text-black text-right"
            }`}
          >
            <p
              className={`font-mono text-xs mb-1 ${
                message.role === "assistant" ? "text-cyan-700" : "text-gray-700"
              }`}
            >
              {message.role === "assistant"
                ? "L.U.C.I. AI ////////"
                : "USER 123 ////////"}
            </p>
            <p className="whitespace-pre-wrap font-mono">{message.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-300 border-l-4 border-cyan-500 p-3 text-sm">
            <p className="text-cyan-700 font-mono text-xs mb-1">
              L.U.C.I. AI ////////
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-600 animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-600 animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-cyan-600 animate-pulse delay-300"></div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-gray-300 border-l-4 border-red-500 p-3 text-sm">
            <p className="text-red-700 font-mono text-xs mb-1">
              SYSTEM ERROR ////////
            </p>
            <p className="font-mono">{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative bg-gray-300 p-2">
        <div className="font-mono text-xs text-gray-700 mb-1 pl-2">
          PROMPT CAN GO HERE...
        </div>
        <div className="flex">
          <Input
            type="text"
            placeholder="Ask L.U.C.I. about predictions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full bg-gray-200 border border-gray-400 p-2 text-sm font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="ml-2 bg-gray-600 hover:bg-gray-700 text-white font-mono text-xs"
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
}
