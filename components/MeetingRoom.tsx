"use client";
import { useState, useEffect } from "react";
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from "@stream-io/video-react-sdk";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutList, Users, MessageCircle, PencilRuler } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";
import { useSocket } from "@/context/SocketProvider";
import Board from "@/components/Board";
import GroupChat from "@/components/GroupChat";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();
  const { socket } = useSocket();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const roomId = "meeting-room";

  useEffect(() => {
    if (socket) {
      socket.emit("join-room", { roomId });

      return () => {
        socket.emit("leave-room", { roomId });
      };
    }
  }, [socket, roomId]);

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition={"left"} />;
      default:
        return <SpeakerLayout participantsBarPosition={"right"} />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white flex flex-col">
      {/* Video Section */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">{<CallLayout />}</div>

        {/* Participants List */}
        {showParticipants && (
          <div className="absolute top-0 left-0 h-full w-[250px] bg-black/50 p-4">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        )}
      </div>

      {showWhiteboard && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <Board socket={socket} workspaceId={roomId} username={"User1"} />
          <button
            onClick={() => setShowWhiteboard(false)}
            className="absolute top-4 right-4 bg-red-500 px-3 py-2 text-white rounded-md"
          >
            Close Whiteboard
          </button>
        </div>
      )}

      <div className="fixed bottom-4 left-1/2 w-4/5 lg:w-1/3  transform -translate-x-1/2 flex flex-wrap items-center space-x-4 bg-gray-950 px-6 py-3 rounded-2xl">
        <CallControls onLeave={() => router.push("/")} />

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-dark-2 px-4 py-3 hover:bg-gray-600">
            <LayoutList size={20} className="text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-dark-1 bg-dark-2 text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <DropdownMenuItem
                key={index}
                className="cursor-pointer"
                onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => setShowParticipants((prev) => !prev)}
          className="cursor-pointer rounded-2xl bg-dark-2 px-4 py-3 hover:bg-dark-3"
        >
          <Users size={20} className="text-white" />
        </button>

        <button
          onClick={() => setShowWhiteboard((prev) => !prev)}
          className="cursor-pointer rounded-2xl bg-dark-2 px-4 py-3 hover:bg-dark-3"
        >
          <PencilRuler size={20} className="text-white" />
        </button>

        <Sheet open={showChat} onOpenChange={setShowChat}  >
          <SheetTrigger>
            <button className="cursor-pointer rounded-2xl bg-dark-2 px-4 py-3 hover:bg-dark-3">
              <MessageCircle size={20} className="text-white" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[350px] bg-dark-2 pt-16 text-white">
            <GroupChat socket={socket} workspaceId={roomId} />
          </SheetContent>
        </Sheet>

        <EndCallButton />
        <CallStatsButton />

      </div>
    </section>
  );
};

export default MeetingRoom;
