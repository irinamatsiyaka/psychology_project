const express = require("express");
const cors = require("cors");
const fs = require("fs"); 
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(
   __dirname,
   "..",
   "src",
   "data",
   "psychologists.json"
);

// Маршрут для получения всех психологов
app.get("/api/psychologists", (req, res) => {
   fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
         return res.status(500).json({ message: "Ошибка чтения данных" });
      }
      const psychologists = JSON.parse(data);
      res.json(psychologists);
   });
});

// Маршрут для добавления нового психолога
app.post("/api/psychologists", (req, res) => {
   const {
      name,
      specialization,
      experience,
      methods,
      location,
      pricePerSession,
      description,
      image,
   } = req.body;

   if (
      !name ||
      !specialization ||
      !experience ||
      !methods ||
      !location ||
      !pricePerSession ||
      !description ||
      !image
   ) {
      return res.status(400).json({ message: "Все поля обязательны" });
   }

   const newPsychologist = {
      id: uuidv4(),
      name,
      specialization,
      experience,
      methods,
      location,
      pricePerSession,
      description,
      image,
   };

   // Чтение текущих данных, добавление нового психолога и запись обратно
   fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
         return res.status(500).json({ message: "Ошибка чтения данных" });
      }
      const psychologists = JSON.parse(data);
      psychologists.push(newPsychologist);

      fs.writeFile(
         dataPath,
         JSON.stringify(psychologists, null, 2),
         (writeErr) => {
            if (writeErr) {
               return res.status(500).json({ message: "Ошибка записи данных" });
            }
            res.status(201).json({
               message: "Психолог добавлен",
               psychologist: newPsychologist,
            });
         }
      );
   });
});

// Маршрут для обновления психолога по id
app.put("/api/psychologists/:id", (req, res) => {
   const { id } = req.params;

   const {
      name,
      specialization,
      experience,
      methods,
      location,
      pricePerSession,
      description,
      image,
   } = req.body;

   fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
         return res.status(500).json({ message: "Ошибка чтения данных" });
      }

      let psychologists = JSON.parse(data);
      const psychologistIndex = psychologists.findIndex(
         (psychologist) => psychologist.id === id
      );

      if (psychologistIndex === -1) {
         console.log("Психолог с таким id не найден"); // Логирование
         return res.status(404).json({ message: "Психолог не найден" });
      }

      const updatedPsychologist = {
         id,
         name: name || psychologists[psychologistIndex].name,
         specialization:
            specialization || psychologists[psychologistIndex].specialization,
         experience: experience || psychologists[psychologistIndex].experience,
         methods: methods || psychologists[psychologistIndex].methods,
         location: location || psychologists[psychologistIndex].location,
         pricePerSession:
            pricePerSession || psychologists[psychologistIndex].pricePerSession,
         description:
            description || psychologists[psychologistIndex].description,
         image: image || psychologists[psychologistIndex].image,
      };

      psychologists[psychologistIndex] = updatedPsychologist;

      fs.writeFile(
         dataPath,
         JSON.stringify(psychologists, null, 2),
         (writeErr) => {
            if (writeErr) {
               return res.status(500).json({ message: "Ошибка записи данных" });
            }
            res.json({
               message: "Психолог обновлен",
               psychologist: updatedPsychologist,
            });
         }
      );
   });
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
