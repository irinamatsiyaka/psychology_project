import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import LandingPage from "../components/firstPage/LandingPage";
import MainApp from "../components/main/MainApp";
import AboutUs from "../components/moreInfo/AboutUs";
import RegisterPage from "../components/firstPage/RegisterPage";
import LoginPage from "../components/firstPage/LoginPage";
import Chat from "../components/firebase/Chat";

const ChatWrapper = () => {
   const { chatId } = useParams();
   const navigate = useNavigate();

   const handleClose = () => {
      console.log("Чат закрыт");
      navigate("/main");
   };

   return (
      <Chat
         psychologistId={chatId || ""}
         chatId={chatId || ""}
         onClose={handleClose}
      />
   );
};

const AppRoutes = () => (
   <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/aboutUs" element={<AboutUs />} />
      <Route path="/main/*" element={<MainApp />} />

      <Route path="/chat/:chatId" element={<ChatWrapper />} />
   </Routes>
);

export default AppRoutes;
