import React, { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import Catalog from "./Catalog";
import Questionnaire from "./Questionnaire";
import Support from "./Support";
import HomePage from "./HomePage";
import "./MainApp.css";
import ChatList from "../firebase/ChatList";
import PsychologistChatList from "../firebase/PsychologistChatList";
import ProfileModal from "./profile/ProfileModal";

const MainApp = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [userData, setUserData] = useState<any>(null);
   const [originalEmail, setOriginalEmail] = useState<string | null>(null);

   useEffect(() => {
      const activeUser = JSON.parse(
         localStorage.getItem("activeUser") || "null"
      );
      if (activeUser) {
         setUserData(activeUser);
         setOriginalEmail(activeUser.email);
      }
   }, []);

   const openModal = () => {
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
   };

   const handleSave = async (updatedUserData: any) => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      const filteredUsers = users.filter(
         (user: any) => user.email !== originalEmail
      );

      const updatedUsers = [...filteredUsers, updatedUserData];
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      localStorage.setItem("activeUser", JSON.stringify(updatedUserData));

      if (updatedUserData.role === "psychologist") {
         try {
            const response = await fetch(
               `http://localhost:3000/api/psychologists/${updatedUserData.id}`,
               {
                  method: "PUT",
                  headers: {
                     "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                     name: updatedUserData.name,
                     specialization: updatedUserData.specialization,
                     experience: updatedUserData.experience,
                     methods: updatedUserData.methods,
                     location: updatedUserData.location,
                     pricePerSession: updatedUserData.pricePerSession,
                     description: updatedUserData.description,
                     image: updatedUserData.image,
                  }),
               }
            );

            if (response.ok) {
               alert("Профиль психолога успешно обновлен!");
            } else {
               alert("Ошибка при обновлении профиля психолога.");
            }
         } catch (error) {
            console.error("Ошибка при обновлении профиля психолога:", error);
         }
      }
   };

   return (
      <div className="main-app">
         <header>
            <h1
               style={{
                  fontFamily: "'Montserrat', sans-serif",
               }}
            >
               Психологи онлайн
            </h1>
            <nav>
               <Link to="/">Главная</Link>
               <Link to="/main/catalog">Каталог</Link>
               <Link to="/main/questionnaire">Анкета</Link>
               <Link to="/main/support">Поддержка</Link>
               {userData?.role === "psychologist" ? (
                  <Link to="/main/psychologist-chat-list">Мои переписки</Link>
               ) : (
                  <Link to="/main/chat-list">Мои переписки</Link>
               )}
               <div className="user-circle" onClick={openModal}></div>
            </nav>
         </header>

         <main>
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route path="catalog" element={<Catalog />} />
               <Route path="questionnaire" element={<Questionnaire />} />
               <Route path="support" element={<Support />} />
               <Route path="*" element={<Navigate to="/" />} />

               {userData?.role === "psychologist" ? (
                  <Route
                     path="/psychologist-chat-list"
                     element={
                        <div
                           style={{
                              fontFamily: "'Montserrat', sans-serif",
                              padding: "0 15px",
                           }}
                        >
                           <h1>Чаты психолога</h1>
                           <PsychologistChatList />
                        </div>
                     }
                  />
               ) : (
                  <Route
                     path="/chat-list"
                     element={
                        <div
                           style={{
                              fontFamily: "'Montserrat', sans-serif",
                              padding: "0 15px",
                           }}
                        >
                           <h1 style={{ fontWeight: 600 }}>Чаты клиента</h1>
                           <ChatList userEmail={userData?.email} />
                        </div>
                     }
                  />
               )}
            </Routes>
         </main>

         <footer
            style={{
               fontFamily: "'Montserrat', sans-serif",
            }}
         >
            <p>© 2024 Психологи онлайн. Все права защищены.</p>
         </footer>

         {isModalOpen && (
            <ProfileModal userData={userData} onClose={closeModal} />
         )}
      </div>
   );
};

export default MainApp;
