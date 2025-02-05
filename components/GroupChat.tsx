/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import TextareaAutosize from "react-textarea-autosize";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs"; // ✅ Use Clerk's useUser() hook
import { Socket } from "socket.io-client";
import Image from "next/image";

function GroupChat({ socket, workspaceId }: { socket: Socket | null; workspaceId: string }) {
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState("");
  const { user, isLoaded } = useUser(); 
  const username = user?.username || user?.firstName || "Anonymous"; 
  const fallbackColor = user?.publicMetadata?.fallbackColor || "#555"; 

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !isLoaded) return; 

    const messageHandler = (result: any) => {
      setMessages((prevMessages : any) => [...prevMessages, result]);
    };

    socket.on("message", messageHandler);
    socket.on("get-chats", (result) => {
      if (result.chats) {
        setMessages(result.chats);
      }
      scrollToBottom();
    });

    socket.emit("get-chats", { workspaceId });

    return () => {
      socket.off("message", messageHandler);
      socket.off("get-chats");
    };
  }, [socket, workspaceId, isLoaded]);

  const sendMessage = async () => {
    if (!input.trim()) return; 

    const payload = {
      workspaceId,
      username,
      message: input, 
      fallBackColour: fallbackColor,
    };

    socket?.emit("message", payload); 

    setMessages((prevMessages : any) => [...prevMessages, payload]); 
    setInput(""); 
  };

  return (
    <div className="w-full h-full bg-dark-1 rounded-xl flex flex-col relative justify-end">
      <div className="h-full w-full flex flex-col justify-start">
        <div className="w-full h-[10%] flex items-center">
          <h1 className="text-xl font-bold mx-8">Messages</h1>
        </div>
        <div className="w-full flex flex-col h-[80%] px-4 overflow-x-hidden overflow-y-auto">
          {messages.map((item: any, index: number) => (
            <div key={index} className={`flex no-scroll my-4 ${item.username === username ? "justify-end" : "justify-start"}`}>
              <div className={`md:w-[70%] w-auto max-w-[70%] p-2 rounded-lg flex flex-col items-start ${item.username === username ? "bg-gradient-to-tr from-dark-1 to-dark-4" : ""}`}>
                <div className="h-10 w-full flex items-center gap-5">
                  {item.avatar ? (
                    <Image src={item.avatar} alt="" className="h-[90%] w-auto rounded-lg" />
                  ) : (
                    <div className="bg-dark-2 px-2 py-1 rounded-lg text-xl font-bold">
                      {item.username[0]}
                    </div>
                  )}
                  <p className="truncate text-white/50 text-lg font-semibold mr-2">{item.username}</p>
                </div>
                <div className="text-white/70 mx-4 text-wrap  break-words">{item.message}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="w-full min-h-[12%] z-20 flex justify-evenly items-end absolute bg-dark-3 rounded-md">
        <div className="w-[80%] flex items-center h-[90%] mb-2">
          <TextareaAutosize
            className="w-full min-h-6 bg-dark-1 rounded-sm p-2 resize-none"
            placeholder="Write message here..."
            maxRows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <svg onClick={sendMessage} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 text-blue-1 mb-3 cursor-pointer">
          <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
        </svg>
      </div>
    </div>
  );
}

export default GroupChat;
