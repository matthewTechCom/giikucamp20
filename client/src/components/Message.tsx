// import React from 'react'
// import { ChatMessage, isMsgMessage, isFileMessage, isSystemMessage, isErrorMessage } from '../types'
// import FileIcon from './FileIcon'
// import { getFileType } from '../utils/fileUtils'

// type MessageProps = {
//   message: ChatMessage
// }

// const Message: React.FC<MessageProps> = ({ message }) => {
//   if (isMsgMessage(message)) {
//     return (
//       <div className="flex items-start space-x-3">
//         {message.userIcon && (
//           <img
//             src={message.userIcon}
//             alt={`${message.username} icon`}
//             className="w-8 h-8 rounded-full object-cover"
//           />
//         )}
//         <div>
//           <div className="text-sm font-semibold text-gray-800">
//             {message.username || 'Unknown'}
//           </div>
//           <div className="bg-white rounded px-3 py-2 text-gray-800">
//             {message.text}
//           </div>
//         </div>
//       </div>
//     )
//   } else if (isFileMessage(message)) {
//     const fileType = getFileType(message.fileName)
//     return (
//       <div className="flex items-start space-x-3">
//         {message.userIcon && (
//           <img
//             src={message.userIcon}
//             alt={`${message.username} icon`}
//             className="w-8 h-8 rounded-full object-cover"
//           />
//         )}
//         <div>
//           <div className="text-sm font-semibold text-gray-800">
//             {message.username || 'Unknown'}
//           </div>
//           <div className="bg-white rounded px-3 py-2 text-gray-800 flex items-center space-x-2">
//             {fileType === 'image' ? (
//               <img
//                 src={message.fileUrl}
//                 alt={message.fileName}
//                 className="max-w-xs max-h-60 object-cover rounded"
//               />
//             ) : (
//               <>
//                 <FileIcon fileType={fileType} />
//                 <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                   {message.fileName || 'ファイルを表示'}
//                 </a>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     )
//   } else if (isSystemMessage(message)) {
//     return (
//       <div className="text-center text-gray-500 italic">
//         {message.text}
//       </div>
//     )
//   } else if (isErrorMessage(message)) {
//     return (
//       <div className="bg-red-100 text-red-700 p-2 rounded">
//         {message.message}
//       </div>
//     )
//   } else {
//     return null
//   }
// }

// export default Message
