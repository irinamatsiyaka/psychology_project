import React, { useState, useEffect } from "react";
import "./Chat.css";
import {
   collection,
   addDoc,
   query,
   onSnapshot,
   orderBy,
   updateDoc,
   doc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

interface ChatProps {
   psychologistId: string;
   chatId: string;
   onClose: () => void;
}

const Chat: React.FC<ChatProps> = ({ psychologistId, chatId, onClose }) => {
   const [messages, setMessages] = useState<any[]>([]);
   const [newMessage, setNewMessage] = useState("");
   const [activeUserEmail, setActiveUserEmail] = useState<string | null>(null);

   useEffect(() => {
      const activeUser = JSON.parse(localStorage.getItem("activeUser") || "{}");
      if (activeUser && activeUser.email) {
         setActiveUserEmail(activeUser.email);
      }

      const q = query(
         collection(db, "chats", chatId, "messages"),
         orderBy("timestamp")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
         setMessages(snapshot.docs.map((doc) => doc.data()));
      });

      return () => unsubscribe();
   }, [chatId]);

   const sendMessage = async () => {
      if (newMessage.trim() !== "") {
         const message = {
            text: newMessage,
            timestamp: new Date(),
            sender: activeUserEmail,
         };

         await addDoc(collection(db, "chats", chatId, "messages"), message);

         await updateDoc(doc(db, "chats", chatId), {
            lastMessageText: message.text,
            lastMessageTimestamp: message.timestamp,
         });

         setNewMessage("");
      }
   };

   return (
      <div className="chat-container">
         <div className="chat-header">
            <h3>Чат с психологом</h3>
            <button onClick={onClose}>Закрыть</button>
         </div>

         <div className="chat-messages">
            {messages.map((msg, index) => (
               <div
                  key={index}
                  className={`message ${
                     msg.sender === activeUserEmail
                        ? "message-client"
                        : "message-psychologist"
                  }`}
               >
                  <p>{msg.text}</p>
               </div>
            ))}
         </div>

         <div className="chat-input">
            <input
               type="text"
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Отправить</button>
         </div>
      </div>
   );
};

export default Chat;
