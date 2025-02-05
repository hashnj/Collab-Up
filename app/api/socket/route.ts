/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

const ioHandler = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    console.log("⚡ Initializing Socket.IO");

    const httpServer: HTTPServer = res.socket.server as any;
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

    res.socket.server.io = io;
  } else {
    console.log("⚡ Socket.IO already running");
  }
  return NextResponse.json({ message: "Socket.IO is running" });
};

export { ioHandler as GET, ioHandler as POST };
