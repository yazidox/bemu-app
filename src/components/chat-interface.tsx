"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Cpu, Send, MessageSquare } from "lucide-react";

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
      <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-gray-400 bg-[#ece9d8]">
        <Cpu size={16} className="text-[#000080] ml-2" />
        <h2 className="font-mono text-sm text-[#000080]">
          L.U.C.I. PREDICTIVE ANALYSIS
        </h2>
        <div className="ml-auto text-xs px-2 py-1 bg-[#c0c0c0] border-2 border-gray-400 text-[#000080] font-mono mr-2 shadow-[inset_-1px_-1px_#707070,inset_1px_1px_#fff]">
          {credits} CREDITS
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-2 mb-2 pr-2 bg-white shadow-inner">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 text-sm ${
              message.role === "assistant"
                ? "bg-[#ece9d8] border-l-2 border-[#000080] text-black ml-1"
                : "bg-[#c0c0c0] border-r-2 border-gray-500 text-black text-right mr-1"
            }`}
          >
            <p
              className={`font-mono text-xs mb-1 ${
                message.role === "assistant" ? "text-[#000080]" : "text-gray-700"
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
          <div className="bg-[#ece9d8] border-l-2 border-[#000080] p-2 text-sm ml-1">
            <p className="text-[#000080] font-mono text-xs mb-1">
              L.U.C.I. AI ////////
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#000080] animate-pulse"></div>
              <div className="w-2 h-2 bg-[#000080] animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-[#000080] animate-pulse delay-300"></div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-[#ece9d8] border-l-2 border-red-500 p-2 text-sm ml-1">
            <p className="text-red-700 font-mono text-xs mb-1">
              SYSTEM ERROR ////////
            </p>
            <p className="font-mono">{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative bg-[#ece9d8] p-2 border-t-2 border-gray-400">
        <div className="font-mono text-xs text-gray-700 mb-1 pl-2">
          ENTER QUERY:
        </div>
        <div className="flex">
          <Input
            type="text"
            placeholder="Ask L.U.C.I. about predictions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full bg-white border-2 border-gray-400 p-2 text-sm font-mono focus:border-[#000080] focus:outline-none shadow-inner"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="ml-2 bg-[#c0c0c0] hover:bg-[#d0d0d0] text-black font-mono text-xs border-2 border-gray-400 shadow-[inset_-1px_-1px_#707070,inset_1px_1px_#fff] active:shadow-[inset_1px_1px_#707070,inset_-1px_-1px_#fff]"
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
}
