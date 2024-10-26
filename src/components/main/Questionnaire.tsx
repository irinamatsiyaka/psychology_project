import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import "./Questionnaire.css";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"; 
import { db } from "../firebase/firebaseConfig"; 
import psychologists from "../../data/psychologists.json"; 

const Questionnaire = () => {
   const [formData, setFormData] = useState({
      specialization: "",
      methods: "",
      experience: "",
      minPrice: 0,
      maxPrice: 10000,
      location: "",
   });
   const [isSending, setIsSending] = useState(false); 

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      if (isSending) {
         return; 
      }

      setIsSending(true); 

      try {
         alert("Анкета отправлена всем психологам!");

         const activeUser = JSON.parse(
            localStorage.getItem("activeUser") || "{}"
         );
         const userEmail = activeUser.email || "guest@example.com";

         for (const psychologist of psychologists) {
            const psychologistId = psychologist.id;

            const chatsRef = collection(db, "chats");
            const existingChatQuery = query(
               chatsRef,
               where("psychologistId", "==", psychologistId),
               where("userId", "==", userEmail)
            );
            const existingChatSnapshot = await getDocs(existingChatQuery);

            if (!existingChatSnapshot.empty) {
               console.log(
                  `Чат с психологом ${psychologist.name} уже существует, не отправляем сообщение`
               );
               continue; 
            }

            const chatDoc = await addDoc(chatsRef, {
               createdAt: new Date().toISOString(),
               psychologistId,
               userId: userEmail,
               timestamp: new Date(),
            });

            const messagesRef = collection(db, "chats", chatDoc.id, "messages");
            await addDoc(messagesRef, {
               text: `Пользователь отправил анкету: 
                  Специализация: ${formData.specialization || "Не указано"}, 
                  Методы: ${formData.methods || "Не указано"}, 
                  Опыт: ${formData.experience || "Не указано"}, 
                  Цена: от ${formData.minPrice} до ${formData.maxPrice}, 
                  Локация: ${formData.location || "Не указано"}`,
               timestamp: new Date(),
            });

            console.log(`Сообщение отправлено психологу: ${psychologist.name}`);
         }

         alert("Анкета успешно отправлена всем психологам!");
      } catch (error) {
         console.error("Ошибка при отправке анкеты:", error);
         alert("Произошла ошибка при отправке анкеты.");
      } finally {
         setIsSending(false); 
      }
   };

   const handleChange = (
      event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
   ) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      const numValue = parseInt(value, 10);

      if (!isNaN(numValue)) {
         setFormData({
            ...formData,
            [name]: numValue,
         });
      }
   };

   const handleSliderChange = (event: Event, newValue: number | number[]) => {
      const [min, max] = newValue as number[];
      setFormData({ ...formData, minPrice: min, maxPrice: max });
   };

   return (
      <form onSubmit={handleSubmit} className="filter">
         <h2>Заполните анкету</h2>
         <label>
            Специализация
            <select
               name="specialization"
               value={formData.specialization}
               onChange={handleChange}
            >
               <option value="">Выберите специализацию</option>
               <option value="familyPsychologist">Семейный психолог</option>
               <option value="clinicalPsychologist">
                  Клинический психолог
               </option>
               <option value="cognitiveBehavioralTherapist">
                  Когнитивно-поведенческий терапевт
               </option>
               <option value="supportPsychologist">Психолог поддержки</option>
            </select>
         </label>

         <label>
            Метод работы
            <select
               name="methods"
               value={formData.methods}
               onChange={handleChange}
            >
               <option value="">Выберите метод работы</option>
               <option value="gestalt">Гештальт</option>
               <option value="cognitiveBehavioral">
                  Когнитивно-поведенческая терапия
               </option>
               <option value="psychoanalysis">Психоанализ</option>
               <option value="emotionallyFocused">
                  Эмоционально-фокусированная терапия
               </option>
            </select>
         </label>

         <label>
            Локация
            <select
               name="location"
               value={formData.location}
               onChange={handleChange}
            >
               <option value="">Выберите локацию</option>
               <option value="Online">Онлайн</option>
               <option value="Minsk">Минск</option>
               <option value="SaintPetersburg">Санкт-Петербург</option>
               <option value="Moscow">Москва</option>
            </select>
         </label>

         <label>
            Опыт работы
            <select
               name="experience"
               value={formData.experience}
               onChange={handleChange}
            >
               <option value="">Выберите опыт работы</option>
               <option value="newbie">менее 1 года</option>
               <option value="amateur">1 - 3 года</option>
               <option value="professional">3 и более</option>
               <option value="steep">5 и более</option>
            </select>
         </label>

         <label>
            <div className="price-inputs">
               Цена:
               <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleInputChange}
                  min="0"
                  max="99999"
                  className="price-input"
               />
               <Slider
                  value={[formData.minPrice, formData.maxPrice]}
                  onChange={handleSliderChange}
                  min={0}
                  max={1000}
                  step={10}
                  valueLabelDisplay="auto"
                  sx={{
                     width: 200,
                     color: "#ff6b6b",
                     margin: "0 auto",
                  }}
               />
               <input
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleInputChange}
                  min="0"
                  max="1000"
                  className="price-input"
               />
               руб.
            </div>
         </label>

         <button type="submit">Подобрать психолога</button>
      </form>
   );
};

export default Questionnaire;
