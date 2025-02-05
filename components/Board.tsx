/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import { Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import { Socket } from "socket.io-client";

function Board({ socket, workspaceId, username }: { socket: Socket | null; workspaceId: string; username: string | undefined }) {
  return (
    <Tldraw className="rounded-lg z-0">
      {socket && <EditorControl socket={socket} username={username} workspaceId={workspaceId} />}
    </Tldraw>
  );
}

function EditorControl({ socket, username, workspaceId }: { socket: Socket | null; username: string | undefined; workspaceId: string }) {
  const editor = useEditor();

  useEffect(() => {
    if (!socket) return; // ✅ Ensure socket is available

    const handleBoardChanges = (data: any) => {
      if (editor && data?.data) {
        const snapshot = editor.store.getSnapshot();
        if (snapshot?.store) {
          for (const key in data.data) {
            if (key.startsWith("shape:")) {
              const shape = data.data[key];
              if (shape) {
                shape.meta = shape.meta || {};
                shape.meta.user = shape.meta.user || data.owner;
                shape.isLocked = shape.meta.user === username ? false : true;
                data.data[key] = shape;
              }
            }
          }
          snapshot.store = data.data;
          editor.store.loadSnapshot(snapshot);
        }
      }
    };

    socket.on("board-changes", handleBoardChanges);

    socket.emit("get-board", { workspaceId, owner: username });

    socket.on("get-board", (data: any) => {
      if (data?.board?.data && editor) {
        const snapshot = editor.store.getSnapshot();
        if (snapshot?.store) {
          for (const key in data.board.data) {
            if (key.startsWith("shape:")) {
              const shape = data.board.data[key];
              shape.meta = shape.meta || {};
              shape.meta.user = shape.meta.user || data.board.owner;
              shape.isLocked = shape.meta.user === username ? false : true;
              data.board.data[key] = shape;
            }
          }
          snapshot.store = data.board.data;
          editor.store.loadSnapshot(snapshot);
        }
      }
    });

    return () => {
      socket.off("board-changes", handleBoardChanges);
      socket.off("get-board");
    };
  }, [editor, socket]);

  useEffect(() => {
    if (editor && socket) {
      editor.on("update", () => {
        const modified = editor.store.getSnapshot();
        socket.emit("board-changes", { data: modified.store, owner: username, workspaceId });
      });
    }
  }, [editor, socket]);

  return null;
}

export default Board;
