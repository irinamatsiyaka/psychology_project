import React from "react";
import { Link, Routes, Route } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import AboutUs from "../moreInfo/AboutUs";

const LandingPage = () => {
   const navigate = useNavigate();

   const handleButtonClick = () => {
      window.open(
         "https://www.youtube.com/watch?v=Dd0xdJjDuyg",
         "_blank",
         "noopener,noreferrer"
      );
   };

   return (
      <div className="landing-page">
         <header className="landing-header">
            <nav>
               <h1 className="logo">Психологи онлайн</h1>
               <ul className="nav-links">
                  <li>
                     <a href="#aboutUs">О нас</a>
                  </li>
                  <li>
                     <a href="#services">Наши услуги</a>
                  </li>
                  <li>
                     <a href="#reviews">Отзывы</a>
                  </li>
                  <li>
                     <a href="#contacts">Контакты</a>
                  </li>
                  <li>
                     <button
                        className="signup-button"
                        onClick={() => navigate("/register")}
                     >
                        Зарегистрироваться
                     </button>
                  </li>
               </ul>
            </nav>
         </header>

         <main className="hero-section">
            <Routes>
               <Route path="aboutUs" element={<AboutUs />} />
            </Routes>
            <div className="hero-content">
               <h2>Найдите своего психолога</h2>
               <p>
                  Помогаем вам выбрать лучшего специалиста, который поддержит и
                  направит вас на пути к внутреннему покою и гармонии.
                  Профессиональная помощь доступна в любое время.
               </p>
               <div className="hero-buttons">
                  <button
                     className="primary-button"
                     onClick={() => navigate("/aboutUs")}
                  >
                     Узнать больше
                  </button>
                  <button
                     className="secondary-button"
                     onClick={handleButtonClick}
                  >
                     Посмотреть видео
                  </button>{" "}
               </div>
            </div>
            <img src="/psy_photo.jpg" alt="Hero" className="hero-image" />
         </main>

         <section className="features">
            <div className="feature">
               <div className="feature-icon circle-icon">
                  <span>🧠</span>
               </div>
               <h3>Опытные специалисты</h3>
               <p>
                  Наши психологи имеют многолетний опыт работы и помогают решать
                  самые сложные проблемы.
               </p>
            </div>
            <div className="feature">
               <div className="feature-icon circle-icon">
                  <span>📅</span>
               </div>
               <h3>Удобное расписание</h3>
               <p>
                  Забронируйте сеанс в удобное для вас время — мы всегда готовы
                  вам помочь.
               </p>
            </div>
            <div className="feature">
               <div className="feature-icon circle-icon">
                  <span>💬</span>
               </div>
               <h3>Онлайн консультации</h3>
               <p>
                  Консультации онлайн — комфортно, удобно и безопасно для вас.
               </p>
            </div>
         </section>

         <section className="services">
            <h2 id="services">Наши услуги</h2>
            <div className="service">
               <h3>Индивидуальные консультации</h3>
               <p>
                  Персональные сессии с опытными психологами, которые помогут
                  вам справиться с личными трудностями!
               </p>
            </div>
            <div className="service">
               <h3>Семейная терапия</h3>
               <p>
                  Работа с парами и семьями для улучшения общения и разрешения
                  конфликтов.
               </p>
            </div>
            <div className="service">
               <h3>Коучинг и развитие</h3>
               <p>
                  Помощь в достижении личных и профессиональных целей через
                  коучинг и поддержку.
               </p>
            </div>
         </section>

         <section className="blog">
            <h2>Полезные статьи и советы</h2>
            <div className="blog-post">
               <h3>Как выбрать психолога: советы экспертов</h3>
               <p>
                  Выбор правильного психолога — важный шаг. Читайте наши
                  рекомендации, чтобы не ошибиться.
               </p>
            </div>
            <div className="blog-post">
               <h3>Техники самопомощи в трудные моменты</h3>
               <p>
                  Узнайте, как справляться со стрессом и тревогой с помощью
                  простых и эффективных техник.
               </p>
            </div>
         </section>

         <section className="faq">
            <h2>Часто задаваемые вопросы</h2>
            <div className="faq-item">
               <h3>Как проходит онлайн-консультация?</h3>
               <p>
                  Онлайн-консультация проходит по видеосвязи, в удобное для вас
                  время и место.
               </p>
            </div>
            <div className="faq-item">
               <h3>Как выбрать подходящего психолога?</h3>
               <p>
                  Вы можете воспользоваться нашим каталогом, фильтруя
                  специалистов по опыту, методам и стоимости.
               </p>
            </div>
         </section>

         <section className="testimonials">
            <h2 id="reviews">Отзывы наших клиентов</h2>
            <div className="reviews">
               <div className="testimonial">
                  <p>
                     “Потрясающий сервис, мне помогли найти специалиста, который
                     смог поддержать меня в трудный момент.”
                  </p>
                  <span>— Анна, 34 года</span>
               </div>
               <div className="testimonial">
                  <p>
                     “Удобный формат онлайн консультаций, быстро и эффективно.
                     Очень рекомендую!”
                  </p>
                  <span>— Сергей, 42 года</span>
               </div>

               <div className="testimonial">
                  <p>
                     “Удобный формат онлайн консультаций, быстро и эффективно.
                     Очень рекомендую!”
                  </p>
                  <span>— Сергей, 42 года</span>
               </div>

               <div className="testimonial">
                  <p>
                     “Удобный формат онлайн консультаций, быстро и эффективно.
                     Очень рекомендую!”
                  </p>
                  <span>— Сергей, 42 года</span>
               </div>
            </div>
         </section>

         <section className="contact">
            <h2 id="contacts">Свяжитесь с нами</h2>
            <form className="contact-form">
               <input type="text" placeholder="Ваше имя" required />
               <input type="email" placeholder="Ваш email" required />
               <textarea placeholder="Ваше сообщение" required></textarea>
               <button type="submit" className="contact-button">
                  Отправить
               </button>
            </form>
         </section>
      </div>
   );
};

export default LandingPage;
