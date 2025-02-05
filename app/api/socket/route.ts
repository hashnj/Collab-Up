/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

export async function GET(req: NextRequest) {
  if (!(global as any).io) {
    console.log("⚡ Initializing Socket.IO");

    const httpServer: HTTPServer = (global as any).server || (global as any).process?.server;
    const io = new IOServer(httpServer, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ New client connected:", socket.id);

      socket.on("join-room", ({ roomId }) => {
        socket.join(roomId);
        console.log(`📌 User joined room: ${roomId}`);
      });

      socket.on("whiteboard-changes", (data) => {
        socket.to(data.roomId).emit("update-whiteboard", data);
      });

      socket.on("chat-message", (data) => {
        socket.to(data.roomId).emit("receive-message", data);
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    (global as any).io = io;
  } else {
    console.log("⚡ Socket.IO already running");
  }
  return NextResponse.json({ message: "Socket.IO is running" });
}
