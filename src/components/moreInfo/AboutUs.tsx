import React from "react";
import "./AboutUs.css";

function AboutUs() {
   return (
      <div className="about-us-container">
         <div className="content">
            <h1 className="title">Страница находится в разработке</h1>
            <p className="description">
               Мы работаем над тем, чтобы сделать эту страницу лучше.
               Пожалуйста, загляните позже!
            </p>
            <div className="loader"></div>
         </div>
      </div>
   );
}

export default AboutUs;
