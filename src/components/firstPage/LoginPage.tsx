import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [rememberMe, setRememberMe] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      const savedUser = JSON.parse(
         localStorage.getItem("rememberMe") || "null"
      );
      if (savedUser) {
         setEmail(savedUser.email);
         setPassword(savedUser.password);
         setRememberMe(true);
      }
   }, []);

   const handleLogin = () => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
         (user: { email: string; password: string }) =>
            user.email === email && user.password === password
      );

      if (user) {
         localStorage.setItem("activeUser", JSON.stringify(user));
         if (rememberMe) {
            localStorage.setItem("rememberMe", JSON.stringify(user));
         } else {
            localStorage.removeItem("rememberMe");
         }

         localStorage.setItem("loggedInUser", JSON.stringify(user));

         navigate("/main");
      } else {
         alert("Неверный email или пароль");
      }
   };

   return (
      <div className="login-page">
         <h2>Вход</h2>

         <div>
            <label>Email</label>
            <input
               type="email"
               placeholder="Введите email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />
         </div>

         <div>
            <label>Пароль</label>
            <input
               type="password"
               placeholder="Введите пароль"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />
         </div>

         <button onClick={handleLogin}>Войти</button>
      </div>
   );
};

export default LoginPage;
