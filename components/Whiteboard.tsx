// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { Excalidraw, exportToBlob } from '@excalidraw/excalidraw';
// import { useCall } from '@stream-io/video-react-sdk';
// import { X, Trash, Download } from 'lucide-react';

// const Whiteboard = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//   const call = useCall();
//   const excalidrawRef = useRef<any>(null);
//   const [sceneData, setSceneData] = useState<readonly any[]>([]);

//   useEffect(() => {
//     if (call?.state?.custom?.whiteboardData) {
//       setSceneData(call.state.custom.whiteboardData);
//     }
//   }, [call]);

//   const handleClear = async () => {
//     if (!call || !excalidrawRef.current) return;
//     excalidrawRef.current.updateScene({ elements: [] });
//     await call.update({ custom: { whiteboardData: [] } });
//   };

//   const handleSave = async () => {
//     if (!excalidrawRef.current) return;
//     const blob = await exportToBlob({
//       elements: excalidrawRef.current.getSceneElements(),
//       appState: excalidrawRef.current.getAppState(),
//       files: null, // ✅ FIX: Added the required 'files' property
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'whiteboard.png';
//     a.click();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-900 text-white flex flex-col">
//       <div className="flex justify-between p-4 border-b border-gray-700">
//         <h2>Whiteboard</h2>
//         <div className="flex gap-3">
//           <button onClick={handleClear} className="bg-red-600 p-2 rounded">Clear</button>
//           <button onClick={handleSave} className="bg-blue-600 p-2 rounded">Save</button>
//           <button onClick={onClose}><X size={20} /></button>
//         </div>
//       </div>
//       <Excalidraw initialData={{ elements: sceneData }} ref={excalidrawRef} />
//     </div>
//   );
// };

// export default Whiteboard;
