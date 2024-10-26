import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
const { v4: uuidv4 } = require("uuid");

const RegisterPage = () => {
   const [role, setRole] = useState("client");
   const [username, setUsername] = useState("");
   const [age, setAge] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [password, setPassword] = useState("");
   const [problemDescription, setProblemDescription] = useState("");
   const [experience, setExperience] = useState("");
   const [methods, setMethods] = useState("");
   const [timezones, setTimezones] = useState<string[]>([]);
   const [searchTerm, setSearchTerm] = useState("Minsk");
   const [agreement, setAgreement] = useState(false);
   const [rememberMe, setRememberMe] = useState(false);
   const [errors, setErrors] = useState<{ [key: string]: string }>({});
   const navigate = useNavigate();
   const [specialization, setSpecialization] = useState(""); 
   const [pricePerSession, setPricePerSession] = useState<number | string>(""); 
   const [description, setDescription] = useState(""); 
   const [image, setImage] = useState("");
   const [location, setLocation] = useState(""); 

   useEffect(() => {
      const fetchTimezones = async () => {
         try {
            const response = await fetch(
               "https://worldtimeapi.org/api/timezone"
            );
            const data = await response.json();
            const europeanTimezones = data.filter((zone: string) =>
               zone.startsWith("Europe/")
            );
            const formattedTimezones = europeanTimezones.map((zone: string) =>
               zone.replace("Europe/", "")
            );
            setTimezones(formattedTimezones);
         } catch (error) {
            console.error("Ошибка при получении часовых поясов:", error);
         }
      };
      fetchTimezones();
   }, []);

   const validate = () => {
      const newErrors: { [key: string]: string } = {};

      if (!username) {
         newErrors.username = "Имя обязательно";
      }

      if (!age || isNaN(Number(age)) || Number(age) < 18) {
         newErrors.age = "Возраст должен быть не менее 18 лет";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
         newErrors.email = "Некорректный email";
      }

      if (!password || password.length < 6) {
         newErrors.password = "Пароль должен быть не менее 6 символов";
      }

      if (
         role === "client" &&
         (!problemDescription || problemDescription.length < 0)
      ) {
         newErrors.problemDescription = "Запишите, что вас тревожит";
      }

      if (role === "psychologist") {
         if (!experience || isNaN(Number(experience))) {
            newErrors.experience =
               "Опыт работы обязателен и должен быть числом";
         }

         if (!methods) {
            newErrors.methods = "Методы работы обязательны";
         }

         if (!specialization) {
            newErrors.specialization = "Специализация обязательна";
         }

         if (!location) {
            newErrors.location = "Локация обязательна";
         }

         if (!pricePerSession || isNaN(Number(pricePerSession))) {
            newErrors.pricePerSession =
               "Цена за сессию обязательна и должна быть числом";
         }

         if (!description) {
            newErrors.description = "Описание вашей практики обязательно";
         }

         if (!image) {
            newErrors.image = "Ссылка на изображение обязательна";
         }
      }

      if (!agreement) {
         newErrors.agreement =
            "Необходимо согласиться с политикой обработки данных";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (validate()) {
         const users = JSON.parse(localStorage.getItem("users") || "[]");
         const emailExists = users.some((user: any) => user.email === email);

         if (emailExists) {
            setErrors({
               ...errors,
               email: "Пользователь с этой почтой уже существует",
            });
            return;
         }
         if (role === "client") {
            const newClient = {
               role,
               username,
               age,
               email,
               phone,
               password,
               problemDescription,
            };

            const users = JSON.parse(localStorage.getItem("users") || "[]");
            users.push(newClient);
            localStorage.setItem("users", JSON.stringify(users));

            localStorage.setItem("activeUser", JSON.stringify(newClient));

            navigate("/main");
         } else if (role === "psychologist") {
            const newPsychologist = {
               id: uuidv4(),
               role,
               age,
               phone,
               name: username,
               email,
               password,
               specialization,
               experience: Number(experience),
               methods: methods.split(",").map((method) => method.trim()),
               location,
               pricePerSession: Number(pricePerSession),
               description,
               image,
            };

            try {
               console.log(
                  "Отправляем данные психолога на сервер:",
                  newPsychologist
               );

               const response = await fetch(
                  "http://localhost:3000/api/psychologists",
                  {
                     method: "POST",
                     headers: {
                        "Content-Type": "application/json",
                     },
                     body: JSON.stringify(newPsychologist),
                  }
               );

               if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(
                     errorData.message || "Ошибка при регистрации психолога."
                  );
               }

               const data = await response.json();
               console.log("Ответ от сервера:", data);

               const users = JSON.parse(localStorage.getItem("users") || "[]");
               users.push(newPsychologist);
               localStorage.setItem("users", JSON.stringify(users));
               localStorage.setItem(
                  "activeUser",
                  JSON.stringify(newPsychologist)
               );
               alert("Психолог успешно зарегистрирован!");
               navigate("/main");
            } catch (error) {
               console.error("Ошибка при регистрации психолога:", error);
               alert(
                  "Ошибка: " +
                     (error instanceof Error
                        ? error.message
                        : "Неизвестная ошибка")
               );
            }
         }
      }
   };

   const goToLogin = () => {
      navigate("/login");
   };

   return (
      <div className="register-page">
         <h2>Регистрация</h2>

         <form onSubmit={handleRegister}>
            <div>
               <label>Выберите роль *</label>
               <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="client">Клиент</option>
                  <option value="psychologist">Психолог</option>
               </select>
            </div>

            <div>
               <label>Имя *</label>
               <input
                  type="text"
                  placeholder="Напишите своё имя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
               />
               {errors.username && (
                  <span className="error">{errors.username}</span>
               )}
            </div>

            <div>
               <label>Возраст *</label>
               <input
                  type="number"
                  placeholder="Полных лет"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
               />
               {errors.age && <span className="error">{errors.age}</span>}
            </div>

            <div>
               <label>E-mail *</label>
               <input
                  type="text"
                  placeholder="Электронная почта"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />
               {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div>
               <label>Телефон *</label>
               <input
                  type="text"
                  placeholder="Телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
               />
               {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div>
               <label>Пароль *</label>
               <input
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
               />
               {errors.password && (
                  <span className="error">{errors.password}</span>
               )}
            </div>

            {role === "client" && (
               <div>
                  <label>С чем необходима помощь психолога?</label>
                  <textarea
                     placeholder="Опишите проблему своими словами..."
                     value={problemDescription}
                     onChange={(e) => setProblemDescription(e.target.value)}
                     maxLength={2200}
                  />
                  {errors.problemDescription && (
                     <span className="error">{errors.problemDescription}</span>
                  )}
               </div>
            )}

            {role === "psychologist" && (
               <>
                  <div>
                     <label>Специализация *</label>
                     <input
                        type="text"
                        placeholder="Введите специализацию"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                     />
                     {errors.specialization && (
                        <span className="error">{errors.specialization}</span>
                     )}
                  </div>

                  <div>
                     <label>Опыт работы (лет) *</label>
                     <input
                        type="number"
                        placeholder="Введите опыт работы"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                     />
                     {errors.experience && (
                        <span className="error">{errors.experience}</span>
                     )}
                  </div>

                  <div>
                     <label>Методы работы *</label>
                     <input
                        type="text"
                        placeholder="Введите используемые методы"
                        value={methods}
                        onChange={(e) => setMethods(e.target.value)}
                     />
                     {errors.methods && (
                        <span className="error">{errors.methods}</span>
                     )}
                  </div>

                  <div>
                     <label>Локация *</label>
                     <input
                        type="text"
                        placeholder="Введите локацию"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                     />
                     {errors.location && (
                        <span className="error">{errors.location}</span>
                     )}
                  </div>

                  <div>
                     <label>Цена за сессию (руб.) *</label>
                     <input
                        type="number"
                        placeholder="Введите стоимость"
                        value={pricePerSession}
                        onChange={(e) => setPricePerSession(e.target.value)}
                     />
                     {errors.pricePerSession && (
                        <span className="error">{errors.pricePerSession}</span>
                     )}
                  </div>

                  <div>
                     <label>Описание *</label>
                     <textarea
                        placeholder="Опишите вашу практику"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={2200}
                     />
                     {errors.description && (
                        <span className="error">{errors.description}</span>
                     )}
                  </div>

                  <div>
                     <label>Изображение (URL) *</label>
                     <input
                        type="text"
                        placeholder="Ссылка на изображение"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                     />
                     {errors.image && (
                        <span className="error">{errors.image}</span>
                     )}
                  </div>
               </>
            )}

            <div>
               <label>Выберите свой часовой пояс</label>
               <select>
                  {timezones.length > 0 ? (
                     timezones.map((zone) => (
                        <option key={zone} value={zone}>
                           {zone}
                        </option>
                     ))
                  ) : (
                     <option>Загрузка часовых поясов...</option>
                  )}
               </select>
            </div>

            <div>
               <label>
                  Я согласен с{" "}
                  <a href="/privacy-policy">
                     политикой обработки персональных данных
                  </a>
               </label>
               <input
                  type="checkbox"
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
               />
               {errors.agreement && (
                  <span className="error">{errors.agreement}</span>
               )}
            </div>

            <button type="submit">Зарегистрироваться</button>
            <button type="button" onClick={goToLogin}>
               Войти
            </button>
         </form>
      </div>
   );
};

export default RegisterPage;
