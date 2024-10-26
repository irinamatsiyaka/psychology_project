import React from "react";
import "./Support.css";

const Support = () => {
   const handleSupportClick = () => {
      alert("Сейчас эта функция недоступна. Пожалуйста, ждите обновления.");
   };

   return (
      <div className="support-container">
         <h2>Поддержка</h2>
         <p>Свяжитесь с нами для помощи в выборе психолога.</p>
         <button onClick={handleSupportClick}>Написать в поддержку</button>
      </div>
   );
};

export default Support;
