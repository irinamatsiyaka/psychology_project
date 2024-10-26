import {
   collection,
   doc,
   setDoc,
   addDoc,
   getDocs,
   query,
   where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const createOrGetChat = async (
   psychologistId: string,
   userId: string
) => {
   try {
      const chatsCollection = collection(db, "chats");
      const chatQuery = query(
         chatsCollection,
         where("psychologistId", "==", psychologistId),
         where("userId", "==", userId)
      );
      const chatSnapshot = await getDocs(chatQuery);

      if (!chatSnapshot.empty) {
         const chatId = chatSnapshot.docs[0].id;
         return chatId;
      }

      const newChat = await addDoc(chatsCollection, {
         psychologistId,
         userId,
         createdAt: new Date().toISOString(),
      });
      return newChat.id;
   } catch (error) {
      console.error("Ошибка при создании/получении чата:", error);
   }
};
