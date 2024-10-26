import React from "react";
import { Psychologist } from "../../types/psychologist";
import "./PsychologistCard.css";

interface PsychologistCardProps {
   psychologist: Psychologist;
   onClick: (psychologist: Psychologist) => void;
   onChatClick?: (psychologist: Psychologist) => void;
}

const PsychologistCard: React.FC<PsychologistCardProps> = ({
   psychologist,
   onClick,
   onChatClick,
}) => {
   return (
      <div className="psychologist-card" onClick={() => onClick(psychologist)}>
         <img
            src={psychologist.image}
            alt={psychologist.name}
            className="psychologist-image"
         />
         <div className="psychologist-info">
            <h3 className="psychologist-name">{psychologist.name}</h3>
            <p className="psychologist-specialization">
               {psychologist.specialization}
            </p>
            <p className="psychologist-location">{psychologist.location}</p>
            <p className="psychologist-price">
               Цена за сессию: {psychologist.pricePerSession} руб.
            </p>
            {onChatClick && (
               <button
                  onClick={(e) => {
                     e.stopPropagation();
                     onChatClick(psychologist);
                  }}
               >
                  Написать психологу
               </button>
            )}
         </div>
      </div>
   );
};

export default PsychologistCard;
