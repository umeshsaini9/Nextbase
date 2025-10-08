"use client";
import { RealtimeChat } from "@/components/chat/realtime-chat";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ChatPage() {
  const [username, setUsername] = useState("");
  return (
    <div>
      <Input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <RealtimeChat roomName="my-chat-room" username={username} />
    </div>
  );
}
