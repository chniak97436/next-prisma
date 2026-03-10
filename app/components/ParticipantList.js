// import React, { useState, useEffect, useRef } from 'react';

// export default function ParticipantList({ participants }) {
//     const [loadingStates, setLoadingStates] = useState({});
//     const imageRefs = useRef([]);

//     const handleImageLoad = (index) => {
//         setLoadingStates(prev => ({ ...prev, [index]: false }));
//     };

//     const handleImageError = (index) => {
//         setLoadingStates(prev => ({ ...prev, [index]: false }));
//     };

//     useEffect(() => {
//         // Initialize loading states for each participant
//         const initialStates = {};
//         participants.forEach((_, index) => {
//             initialStates[index] = true;
//         });
//         setLoadingStates(initialStates);

//         // Reset refs
//         imageRefs.current = participants.map(() => null);
//     }, [participants]);

//     useEffect(() => {
//         // Check if images are already loaded (cached images)
//         const checkImages = () => {
//             participants.forEach((participant, index) => {
//                 const img = imageRefs.current[index];
//                 if (img && img.complete && img.naturalHeight !== 0) {
//                     setLoadingStates(prev => ({ ...prev, [index]: false }));
//                 }
//             });
//         };

//         // Check immediately
//         checkImages();

//         // Also check after a short delay to catch any images that load quickly
//         const timeoutId = setTimeout(checkImages, 100);

//         return () => clearTimeout(timeoutId);
//     }, [participants]);

//     return (
//         <div className="flex -space-x-2">
//             {participants.map((participant, index) => (
//                 <div key={participant.id || index} className="relative">
//                     {loadingStates[index] !== false && (
//                         <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full"></div>
//                     )}
//                     <img
//                         ref={(el) => (imageRefs.current[index] = el)}
//                         src={participant.image}
//                         alt={participant.name}
//                         className="w-10 h-10 rounded-full border-2 border-white"
//                         onLoad={() => handleImageLoad(index)}
//                         onError={() => handleImageError(index)}
//                     />
//                 </div>
//             ))}
//         </div>
//     );
// }
