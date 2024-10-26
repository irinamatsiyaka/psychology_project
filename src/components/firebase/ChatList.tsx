import "./ChatList.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
   collection,
   query,
   onSnapshot,
   orderBy,
   getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import psychologists from "../../data/psychologists.json";

interface Chat {
   id: string;
   userId: string;
   psychologistId: string;
   psychologistName: string;
   psychologistImage: string;
   lastMessageText: string;
   lastMessageTimestamp: Date | null;
}

interface ChatListProps {
   userEmail: string;
}

const ChatList: React.FC<ChatListProps> = ({ userEmail }) => {
   const [chats, setChats] = useState<Chat[]>([]);
   const [activeUserEmail, setActiveUserEmail] = useState<string | null>(null);

   useEffect(() => {
      const activeUser = JSON.parse(localStorage.getItem("activeUser") || "{}");
      if (activeUser && activeUser.email) {
         setActiveUserEmail(activeUser.email);
      }
   }, []);

   useEffect(() => {
      const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
         const userChats = await Promise.all(
            snapshot.docs.map(async (docSnapshot) => {
               const data = docSnapshot.data();
               let psychologistName = "Неизвестный психолог";
               let psychologistImage = "";
               let lastMessageText = "Нет сообщений";
               let lastMessageTimestamp: Date | null = null;

               const psychologist = psychologists.find(
                  (psych) => psych.id === data.psychologistId
               );

               if (psychologist) {
                  psychologistName = psychologist.name;
                  psychologistImage = psychologist.image;
               }

               const messagesCollection = collection(
                  db,
                  "chats",
                  docSnapshot.id,
                  "messages"
               );
               const messagesQuery = query(
                  messagesCollection,
                  orderBy("timestamp", "desc")
               );
               const messagesSnapshot = await getDocs(messagesQuery);

               if (!messagesSnapshot.empty) {
                  const lastMessage = messagesSnapshot.docs[0].data();
                  lastMessageText = lastMessage.text;
                  lastMessageTimestamp = lastMessage.timestamp.toDate();
               }

               return {
                  id: docSnapshot.id,
                  userId: data.userId,
                  psychologistId: data.psychologistId,
                  psychologistName,
                  psychologistImage,
                  lastMessageText,
                  lastMessageTimestamp,
               };
            })
         ).then((chats) =>
            chats.filter(
               (chat) =>
                  (chat.userId === activeUserEmail ||
                     chat.psychologistId === "1") &&
                  chat.lastMessageText !== "Нет сообщений"
            )
         );

         setChats(userChats);
      });

      return () => unsubscribe();
   }, [activeUserEmail]);

   const formatTime = (timestamp: Date | null) => {
      if (!timestamp) return "";
      const options: Intl.DateTimeFormatOptions = {
         hour: "2-digit",
         minute: "2-digit",
      };
      return new Intl.DateTimeFormat("ru-RU", options).format(timestamp);
   };

   return (
      <div className="chat-list-container">
         <h2>Ваши чаты</h2>
         <ul>
            {chats.length > 0 ? (
               chats.map((chat) => (
                  <li key={chat.id}>
                     <Link to={`/chat/${chat.id}`} className="chat-link">
                        <div className="chat-avatar">
                           {chat.psychologistImage && (
                              <img
                                 src={chat.psychologistImage}
                                 alt={chat.psychologistName}
                                 className="avatar"
                              />
                           )}
                        </div>
                        <div className="chat-details">
                           <p className="chat-name">{chat.psychologistName}</p>
                           <p className="chat-last-message">
                              {chat.lastMessageText}
                           </p>
                        </div>
                        <div className="chat-time">
                           {formatTime(chat.lastMessageTimestamp)}
                        </div>
                     </Link>
                  </li>
               ))
            ) : (
               <p>Нет чатов для отображения.</p>
            )}
         </ul>
      </div>
   );
};

export default ChatList;
