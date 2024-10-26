import React from "react";
import "./PsychologistDetailsModal.css";

interface PsychologistDetailsModalProps {
   psychologist: {
      id: string;
      name: string;
      specialization: string;
      experience: number;
      methods: string[];
      location: string;
      pricePerSession: number;
      description: string;
      image: string;
   };
   onClose: () => void;
   onChatClick: (psychologistId: string) => void;
}

const PsychologistDetailsModal: React.FC<PsychologistDetailsModalProps> = ({
   psychologist,
   onClose,
   onChatClick,
}) => {
   const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
      if ((event.target as Element).classList.contains("modal-overlay")) {
         onClose();
      }
   };

   return (
      <div className="modal-overlay" onClick={handleClickOutside}>
         <div className="modal-container">
            <button className="close-button" onClick={onClose}>
               &times;
            </button>
            <h2>{psychologist.name}</h2>
            <img
               src={psychologist.image}
               alt={psychologist.name}
               className="modal-image"
            />
            <p>Специализация: {psychologist.specialization}</p>
            <p>Опыт работы: {psychologist.experience} лет</p>
            <p>Методы: {psychologist.methods.join(", ")}</p>
            <p>Локация: {psychologist.location}</p>
            <p>Цена за сессию: {psychologist.pricePerSession} руб.</p>
            <p>{psychologist.description}</p>

            <button
               className="chat-button"
               onClick={() => onChatClick(psychologist.id)}
            >
               Написать психологу
            </button>
         </div>
      </div>
   );
};

export default PsychologistDetailsModal;
