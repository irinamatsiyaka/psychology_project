import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchPsychologists } from "../../redux/psychologistsSlice";
import PsychologistCard from "./PsychologistCard";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import "./Catalog.css";
import PsychologistDetailsModal from "./PsychologistDetailsModal";
import Chat from "../firebase/Chat";
import { Psychologist } from "../../types/psychologist";
import { createOrGetChat } from "../firebase/chatService";

const specializations = [
   "Семейный психолог",
   "Клинический психолог",
   "Когнитивно-поведенческий терапевт",
   "Психолог поддержки",
   "Детский психолог",
   "Когнитивно-поведенческая терапия",
];

const Catalog = () => {
   const dispatch = useAppDispatch();
   const psychologists = useSelector(
      (state: RootState) => state.psychologists.list
   );

   const [filters, setFilters] = useState({
      specialization: [] as string[],
      minExperience: 0,
      maxPrice: 99999,
      location: "",
   });

   const [isChatOpen, setIsChatOpen] = useState(false);
   const [selectedPsychologist, setSelectedPsychologist] =
      useState<Psychologist | null>(null);
   const [isFilterOpen, setIsFilterOpen] = useState(false);

   const [chatId, setChatId] = useState<string | null>(null);

   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 9;

   const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = event.target;

      if (name === "specialization") {
         setFilters((prevFilters) => {
            const newSpecializations = checked
               ? [...prevFilters.specialization, value]
               : prevFilters.specialization.filter((spec) => spec !== value);
            return { ...prevFilters, specialization: newSpecializations };
         });
      } else {
         setFilters({ ...filters, [name]: value });
      }
   };

   const handleApplyFilters = () => {
      setIsFilterOpen(false);
   };

   const closeFilterPanel = () => {
      setIsFilterOpen(false);
   };

   const openPsychologistDetails = (psychologist: any) => {
      setSelectedPsychologist(psychologist);
   };

   const closeModal = () => {
      setSelectedPsychologist(null);
   };

   const openChat = async (psychologistId: string) => {
      console.log(`Открытие чата с психологом ID: ${psychologistId}`);

      const activeUser = JSON.parse(localStorage.getItem("activeUser") || "{}");
      const userEmail = activeUser.email || "guest@example.com";

      const chatId = await createOrGetChat(psychologistId, userEmail);

      if (chatId) {
         setChatId(chatId);
         setIsChatOpen(true);
         console.log(`Чат открыт с ID: ${chatId}`);

         const chatWindowUrl = `/chat/${chatId}`;
         window.open(chatWindowUrl, "_blank");
      } else {
         console.error("Не удалось создать или получить чат.");
      }
   };

   const closeChat = () => {
      setIsChatOpen(false);
   };

   useEffect(() => {
      dispatch(fetchPsychologists());
   }, [dispatch]);

   const indexOfLastPsychologist = currentPage * itemsPerPage;
   const indexOfFirstPsychologist = indexOfLastPsychologist - itemsPerPage;
   const currentPsychologists = psychologists.slice(
      indexOfFirstPsychologist,
      indexOfLastPsychologist
   );

   const totalPages = Math.ceil(psychologists.length / itemsPerPage);

   const handleClick = (pageNumber: number) => {
      setCurrentPage(pageNumber);
   };

   const filteredPsychologists = currentPsychologists.filter((psychologist) => {
      return (
         (filters.specialization.length === 0 ||
            filters.specialization.includes(psychologist.specialization)) &&
         psychologist.experience >= filters.minExperience &&
         psychologist.pricePerSession <= filters.maxPrice &&
         (filters.location === "" ||
            psychologist.location.includes(filters.location))
      );
   });

   return (
      <div className="catalog">
         <div className="catalog-header">
            <h2>Каталог психологов</h2>
            <button
               className="filter-toggle"
               onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
               <img
                  src="/filter-icon.png"
                  alt="Фильтр"
                  className="filter-icon"
               />
            </button>
         </div>

         <div className={`filter-panel ${isFilterOpen ? "open" : ""}`}>
            <button className="close-filter" onClick={closeFilterPanel}>
               &times;
            </button>
            <h3>Фильтры</h3>

            <label className="specializations">Специализация:</label>
            {specializations.map((spec) => (
               <div key={spec}>
                  <input
                     type="checkbox"
                     name="specialization"
                     value={spec}
                     checked={filters.specialization.includes(spec)}
                     onChange={handleFilterChange}
                  />
                  <label>{spec}</label>
               </div>
            ))}

            <label className="specializations">
               Опыт работы (лет):
               <input
                  type="number"
                  name="minExperience"
                  value={filters.minExperience}
                  onChange={handleFilterChange}
                  min="0"
                  placeholder="Введите минимальный опыт"
               />
            </label>

            <label className="specializations">
               Максимальная цена за сессию:
               <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  min="0"
                  placeholder="Введите максимальную цену"
               />
            </label>

            <label className="specializations">
               Локация:
               <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Введите локацию"
               />
            </label>

            <button onClick={handleApplyFilters}>Применить фильтры</button>
         </div>

         <div className="psychologists-grid">
            {filteredPsychologists.length > 0 ? (
               filteredPsychologists.map((psychologist) => (
                  <PsychologistCard
                     key={psychologist.id}
                     psychologist={psychologist}
                     onClick={() => openPsychologistDetails(psychologist)}
                     onChatClick={() => openChat(psychologist.id)}
                  />
               ))
            ) : (
               <p>Нет данных для отображения.</p>
            )}
         </div>
         {selectedPsychologist && (
            <PsychologistDetailsModal
               psychologist={selectedPsychologist}
               onClose={closeModal}
               onChatClick={openChat}
            />
         )}

         {isChatOpen && selectedPsychologist && (
            <Chat
               psychologistId={selectedPsychologist.id}
               chatId={chatId || ""}
               onClose={closeChat}
            />
         )}

         <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
               <button
                  key={index + 1}
                  className={`pagination-button ${
                     currentPage === index + 1 ? "active" : ""
                  }`}
                  onClick={() => handleClick(index + 1)}
               >
                  {index + 1}
               </button>
            ))}
         </div>
      </div>
   );
};

export default Catalog;
