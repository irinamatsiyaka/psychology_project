import "./ChatList.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
   collection,
   query,
   onSnapshot,
   orderBy,
   where,
   getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import psychologists from "../../data/psychologists.json";

interface Chat {
   id: string;
   userId: string;
   psychologistId: string;
   lastMessageText: string;
   lastMessageTimestamp: Date | null;
}

const PsychologistChatList = () => {
   const [chats, setChats] = useState<Chat[]>([]);
   const [psychologistId, setPsychologistId] = useState<string | null>(null);

   useEffect(() => {
      const activeUser = JSON.parse(localStorage.getItem("activeUser") || "{}");
      if (activeUser && activeUser.name) {
         const psychologist = psychologists.find(
            (p) => p.name === activeUser.name
         );
         if (psychologist) {
            setPsychologistId(psychologist.id);
            console.log(`Psychologist ID: ${psychologist.id}`);
         } else {
            console.log("Психолог не найден.");
         }
      }
   }, []);

   useEffect(() => {
      const fetchChats = async () => {
         if (psychologistId) {
            const q = query(
               collection(db, "chats"),
               where("psychologistId", "==", psychologistId),
               orderBy("createdAt", "desc")
            );

            const unsubscribe = onSnapshot(q, async (snapshot) => {
               if (snapshot.empty) {
                  console.log("Нет чатов для отображения");
                  setChats([]);
                  return;
               }

               const psychologistChats = await Promise.all(
                  snapshot.docs.map(async (docSnapshot) => {
                     const data = docSnapshot.data();

                     console.log("Данные чата:", data);

                     let lastMessageText = "Нет сообщений";
                     let lastMessageTimestamp: Date | null = null;

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
                        lastMessageText,
                        lastMessageTimestamp,
                     };
                  })
               ).then((chats) =>
                  chats.filter(
                     (chat) => chat.lastMessageText !== "Нет сообщений"
                  )
               );

               console.log("Чаты психолога:", psychologistChats);

               setChats(psychologistChats);
            });

            return () => unsubscribe();
         }
      };

      fetchChats();
   }, [psychologistId]);

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
         <h2>Чаты психолога</h2>
         <ul>
            {chats.length > 0 ? (
               chats.map((chat) => (
                  <li key={chat.id}>
                     <Link to={`/chat/${chat.id}`} className="chat-link">
                        <div className="chat-avatar">
                           <div className="avatar-circle"></div>
                        </div>
                        <div className="chat-details">
                           <p className="chat-name">{chat.userId}</p>{" "}
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

export default PsychologistChatList;
