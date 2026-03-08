import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiSend, FiShield } from "react-icons/fi";
import { useState } from "react";

const conversations = [
  { id: 1, name: "Fatima A.", lastMsg: "JazakAllah, I'll let my family know.", time: "2 min ago", unread: 2, verified: true },
  { id: 2, name: "Aisha R.", lastMsg: "Yes, that works. InShaAllah.", time: "1 hour ago", unread: 0, verified: true },
  { id: 3, name: "Sara K.", lastMsg: "Assalamu Alaikum", time: "Yesterday", unread: 1, verified: false },
];

const messages = [
  { id: 1, from: "them", text: "Assalamu Alaikum! I read your profile and it looks great MashaAllah.", time: "10:00 AM" },
  { id: 2, from: "me", text: "Wa Alaikum Assalam! JazakAllah. I found your profile interesting as well.", time: "10:05 AM" },
  { id: 3, from: "them", text: "Alhamdulillah. My family is also involved in this process. Would you like to share more about yourself?", time: "10:08 AM" },
  { id: 4, from: "me", text: "Of course, I believe in keeping things halal. My wali is also aware.", time: "10:12 AM" },
  { id: 5, from: "them", text: "JazakAllah, I'll let my family know.", time: "10:15 AM" },
];

const Messages = () => {
  const [selected, setSelected] = useState(conversations[0]);
  const [newMsg, setNewMsg] = useState("");

  return (
    <div className="flex h-[calc(100vh-var(--size-navbar))]">
      {/* Conversation List */}
      <div className="w-80 border-r border-border bg-card flex-shrink-0 hidden md:flex flex-col">
        <div className="p-token-4 border-b border-border">
          <h2 className="font-display text-token-lg font-semibold text-foreground">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`w-full text-left p-token-4 border-b border-border hover:bg-muted transition-colors flex gap-token-3 ${
                selected.id === c.id ? "bg-primary/5" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-sm font-bold flex-shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-token-sm font-medium text-foreground truncate flex items-center gap-token-1">
                    {c.name}
                    {c.verified && <FiShield className="text-primary" style={{ fontSize: "var(--text-xs)" }} />}
                  </p>
                  <span className="text-token-xs text-muted-foreground flex-shrink-0">{c.time}</span>
                </div>
                <p className="text-token-xs text-muted-foreground truncate">{c.lastMsg}</p>
              </div>
              {c.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-token-xs flex items-center justify-center flex-shrink-0">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-token-4 border-b border-border bg-card flex items-center gap-token-3">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-xs font-bold">
            {selected.name.charAt(0)}
          </div>
          <div>
            <p className="text-token-sm font-medium text-foreground flex items-center gap-token-1">
              {selected.name}
              {selected.verified && <FiShield className="text-primary" style={{ fontSize: "var(--text-xs)" }} />}
            </p>
            <p className="text-token-xs text-muted-foreground">Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-token-4 space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-token-4 py-token-3 ${
                  msg.from === "me"
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                <p className="text-token-sm">{msg.text}</p>
                <p className={`text-token-xs mt-token-1 ${msg.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-token-4 border-t border-border bg-card">
          <div className="flex gap-token-3">
            <Input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button variant="hero" size="icon">
              <FiSend style={{ fontSize: "var(--size-icon)" }} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
