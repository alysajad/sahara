"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Hash, Send, Users, Settings } from "lucide-react";

const channels = [
  { id: "general", name: "general", type: "text" },
  { id: "sahara-fest", name: "sahara-fest", type: "text" },
  { id: "batch-2019", name: "batch-2019", type: "text" },
  { id: "batch-2020", name: "batch-2020", type: "text" },
  { id: "batch-2021", name: "batch-2021", type: "text" },
];

const messages = [
  {
    id: 1,
    user: "Rahul Sharma",
    avatar: "/memories/Acer_Wallpaper_01_3840x2400.jpg",
    content: "Hey everyone! Who's excited for Sahara Fest 2026?",
    timestamp: "2:30 PM",
  },
  {
    id: 2,
    user: "Priya Patel",
    avatar: "/memories/Acer_Wallpaper_02_3840x2400.jpg",
    content: "I am! Can't wait to see everyone again. It's been too long!",
    timestamp: "2:32 PM",
  },
  {
    id: 3,
    user: "Arun Kumar",
    avatar: "/memories/Acer_Wallpaper_03_3840x2400.jpg",
    content: "Same here! The countdown is killing me. Only 45 days left!",
    timestamp: "2:35 PM",
  },
  {
    id: 4,
    user: "Sneha Reddy",
    avatar: "/memories/Acer_Wallpaper_04_3840x2400.jpg",
    content: "Has anyone started planning their travel yet? I need recommendations for flights.",
    timestamp: "2:38 PM",
  },
];

const onlineUsers = [
  { name: "Rahul Sharma", avatar: "/memories/Acer_Wallpaper_01_3840x2400.jpg", status: "online" },
  { name: "Priya Patel", avatar: "/memories/Acer_Wallpaper_02_3840x2400.jpg", status: "online" },
  { name: "Arun Kumar", avatar: "/memories/Acer_Wallpaper_03_3840x2400.jpg", status: "away" },
  { name: "Sneha Reddy", avatar: "/memories/Acer_Wallpaper_04_3840x2400.jpg", status: "online" },
];

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the server
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        {/* Server Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-semibold">Sahara Connect</h1>
        </div>

        {/* Channels */}
        <div className="flex-1 p-2">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
              Text Channels
            </h3>
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={`w-full text-left px-2 py-1 rounded mb-1 flex items-center gap-2 text-sm hover:bg-gray-700 transition-colors ${
                  selectedChannel === channel.id ? "bg-gray-700 text-white" : "text-gray-400"
                }`}
              >
                <Hash className="w-4 h-4" />
                {channel.name}
              </button>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="p-2 border-t border-gray-700">
          <div className="flex items-center gap-2 p-2 rounded bg-gray-700">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/memories/Acer_Wallpaper_01_3840x2400.jpg" />
              <AvatarFallback>RS</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">Rahul Sharma</div>
              <div className="text-xs text-gray-400">#1234</div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4">
          <Hash className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="font-semibold text-gray-800">{selectedChannel}</h2>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={message.avatar} />
                  <AvatarFallback>{message.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{message.user}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <p className="text-gray-700">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #${selectedChannel}`}
              className="flex-1 bg-white text-black"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Online Users Sidebar */}
      <div className="w-60 bg-gray-50 border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Online — {onlineUsers.filter(u => u.status === "online").length}
          </h3>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {onlineUsers.map((user) => (
              <div key={user.name} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    user.status === "online" ? "bg-green-500" : "bg-yellow-500"
                  }`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}