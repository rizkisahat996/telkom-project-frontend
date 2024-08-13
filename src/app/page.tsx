"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import parse from "html-react-parser";
import { Create, Login } from "@mui/icons-material";

interface Message {
  id: number;
  message: string;
  sender: "user" | "assistant";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/conversations"
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/conversations",
        { message: input }
      );
      setMessages([...messages, ...response.data]);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setIsLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="grid min-h-screen grid-cols-6 items-center">
      <div className="flex flex-col bg-beige h-full min-h-screen">
        <div className="flex justify-between p-3">
          <div className="max-w-12 max-h-12 overflow-hidden cursor-pointer rounded-md border-beige hover:border-purple border">
            <Login className="w-full h-full p-2" />
          </div>
          <div className="max-w-12 max-h-12 overflow-hidden cursor-pointer rounded-md border-beige hover:border-purple border">
            <Create className="w-full h-full p-2" />
          </div>
        </div>
        <div className="flex flex-col p-3 px-5">
          <div className="flex flex-col">
            <h2 className="mb-5">A Day Ago</h2>
            <div className="rounded-lg p-2 border border-beige hover:border-purple overflow-hidden text-center cursor-pointer">
              <p>Contoh Judul Percakapan</p>
            </div>
            <div className="rounded-lg p-2 border border-beige hover:border-purple overflow-hidden text-center cursor-pointer">
              <p>Contoh Judul Percakapan</p>
            </div>
            <div className="rounded-lg p-2 border border-beige hover:border-purple overflow-hidden text-center cursor-pointer">
              <p>Contoh Judul Percakapan</p>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="mb-5">A Day Ago</h2>
            <div className="rounded-lg p-2 border border-beige hover:border-purple overflow-hidden text-center cursor-pointer">
              <p>Contoh Judul Percakapan</p>
            </div>
            <div className="rounded-lg p-2 border border-beige hover:border-purple overflow-hidden text-center cursor-pointer">
              <p>Contoh Judul Percakapan</p>
            </div>
            <div className="rounded-lg p-2 border border-beige hover:border-purple overflow-hidden text-center cursor-pointer">
              <p>Contoh Judul Percakapan</p>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="mb-5">A Day Ago</h2>
            <div className="rounded-lg p-2 border border-beige hover:border-purple overflow-hidden text-center cursor-pointer">
              <p>Contoh Judul Percakapan</p>
            </div>
            <div className="rounded-lg p-2 border border-beige hover:border-purple overflow-hidden text-center cursor-pointer">
              <p>Contoh Judul Percakapan</p>
            </div>
            <div className="rounded-lg p-2 border border-beige hover:border-purple overflow-hidden text-center cursor-pointer">
              <p>Contoh Judul Percakapan</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-purple z-10 items-center justify-between font-mono text-sm h-fit min-h-screen col-span-5">
        <h1 className="text-4xl font-bold text-center p-5">Chat Assistant</h1>
        <hr />
        <div className="shadow-md w-full mx-auto h-full">
          <div className="h-[84.5vh] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.sender === "user"
                      ? "bg-semipurple text-white"
                      : "text-gray-800"
                  } rounded-lg p-2 max-w-xs`}
                >
                  {parse(message.message)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-purple"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-beige text-white px-4 py-2 rounded-r-md hover:bg-semipurple focus:outline-none focus:ring-2 focus:ring-beige"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
