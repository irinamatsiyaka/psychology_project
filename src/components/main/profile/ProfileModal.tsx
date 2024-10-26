import React, { useState, useEffect } from "react";
import psychologists from "../../../data/psychologists.json";
import "./ProfileModal.css";

interface UserData {
   id: string;
   name: string;
   specialization?: string;
   experience?: number;
   methods?: string | string[];
   location?: string;
   pricePerSession?: number;
   description?: string;
   role: string;
   image?: string;
   username?: string;
   age?: string;
   problemDescription?: string;
}

const ProfileModal: React.FC<{ userData: UserData; onClose: () => void }> = ({
   userData: initialUserData,
   onClose,
}) => {
   const [userData, setUserData] = useState<UserData>(initialUserData);
   const [psychologistId, setPsychologistId] = useState<string | null>(null);

   useEffect(() => {
      const activeUser = JSON.parse(localStorage.getItem("activeUser") || "{}");
      if (activeUser && activeUser.name) {
         const psychologist = psychologists.find(
            (p) => p.name === activeUser.name
         );
         if (psychologist) {
            setPsychologistId(psychologist.id);

            setUserData({
               ...userData,
               ...psychologist,
               experience: Number(psychologist.experience), 
               pricePerSession: Number(psychologist.pricePerSession), 
            });

            console.log(`Psychologist ID: ${psychologist.id}`); 
         } else {
            console.log("Психолог не найден.");
         }
      }
   }, []);

   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;
      setUserData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   const handleSave = async () => {
      try {
         if (userData.role === "psychologist") {
            const response = await fetch(
               `http://localhost:3000/api/psychologists/${userData.id}`,
               {
                  method: "PUT",
                  headers: {
                     "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                     name: userData.name,
                     specialization: userData.specialization,
                     experience: userData.experience,
                     methods: userData.methods,
                     location: userData.location,
                     pricePerSession: userData.pricePerSession,
                     description: userData.description,
                     image: userData.image,
                  }),
               }
            );

            if (response.ok) {
               alert("Профиль психолога успешно обновлен!");
            } else {
               alert("Ошибка при обновлении профиля психолога.");
            }
         } else {
            localStorage.setItem("activeUser", JSON.stringify(userData));
            alert("Профиль клиента успешно обновлен!");

            const updatedClientData = JSON.parse(
               localStorage.getItem("activeUser") || "{}"
            );
            setUserData((prevData) => ({
               ...prevData,
               ...userData, 
            }));
         }
      } catch (error) {
         console.error("Ошибка при сохранении профиля:", error);
      }

      onClose(); 
   };

   return (
      <div className="modal">
         <div className="modal-content">
            <h3>Редактировать профиль</h3>

            {userData.role === "psychologist" ? (
               <>
                  <div>
                     <label>Имя</label>
                     <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                     />
                  </div>

                  <div>
                     <label>Специализация</label>
                     <input
                        type="text"
                        name="specialization"
                        value={userData.specialization || ""}
                        onChange={handleInputChange}
                     />
                  </div>

                  <div>
                     <label>Опыт работы</label>
                     <input
                        type="text"
                        name="experience"
                        value={userData.experience || ""}
                        onChange={handleInputChange}
                     />
                  </div>

                  <div>
                     <label>Методы</label>
                     <input
                        type="text"
                        name="methods"
                        value={
                           Array.isArray(userData.methods)
                              ? userData.methods.join(", ")
                              : userData.methods || "" 
                        }
                        onChange={handleInputChange}
                     />
                  </div>

                  <div>
                     <label>Локация</label>
                     <input
                        type="text"
                        name="location"
                        value={userData.location || ""}
                        onChange={handleInputChange}
                     />
                  </div>

                  <div>
                     <label>Цена за сессию</label>
                     <input
                        type="number"
                        name="pricePerSession"
                        value={userData.pricePerSession || 0}
                        onChange={handleInputChange}
                     />
                  </div>

                  <div>
                     <label>Описание</label>
                     <textarea
                        name="description"
                        value={userData.description || ""}
                        onChange={handleInputChange}
                     />
                  </div>

                  <div>
                     <label>Фото (URL)</label>
                     <input
                        type="text"
                        name="image"
                        value={userData.image || ""}
                        onChange={handleInputChange}
                     />
                  </div>
               </>
            ) : (
               <>
                  <div>
                     <label>Имя пользователя</label>
                     <input
                        type="text"
                        name="username"
                        value={userData.username || ""}
                        onChange={handleInputChange}
                     />
                  </div>

                  <div>
                     <label>Возраст</label>
                     <input
                        type="text"
                        name="age"
                        value={userData.age || ""}
                        onChange={handleInputChange}
                     />
                  </div>

                  <div>
                     <label>Описание проблемы</label>
                     <textarea
                        name="problemDescription"
                        value={userData.problemDescription || ""}
                        onChange={handleInputChange}
                     />
                  </div>
               </>
            )}

            <div className="button-container">
               <button onClick={handleSave}>Сохранить</button>
               <button onClick={onClose}>Закрыть</button>
            </div>
         </div>
      </div>
   );
};

export default ProfileModal;
