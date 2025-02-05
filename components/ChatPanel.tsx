// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
// import { StreamChat } from 'stream-chat';
// import { useCall } from '@stream-io/video-react-sdk';
// import { X } from 'lucide-react';

// const Chat = dynamic(() => import('stream-chat-react').then((mod) => mod.Chat), { ssr: false });
// const Channel = dynamic(() => import('stream-chat-react').then((mod) => mod.Channel), { ssr: false });

// const chatClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!);

// const ChatPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//   const call = useCall();
//   const [channel, setChannel] = useState<any>(null);

//   useEffect(() => {
//     if (!call) return;
//     const chatChannel = chatClient.channel('messaging', `chat-${call.id}`, { name: `Chat for ${call.id}` });
//     chatChannel.watch().then(() => setChannel(chatChannel));
//   }, [call]);

//   if (!isOpen || !channel) return null;

//   return (
//     <aside className="fixed right-0 top-0 h-full w-80 bg-gray-800 p-4">
//       <button onClick={onClose}><X size={20} /></button>
//       <Chat client={chatClient}>
//         <Channel channel={channel} />
//       </Chat>
//     </aside>
//   );
// };

// export default ChatPanel;
