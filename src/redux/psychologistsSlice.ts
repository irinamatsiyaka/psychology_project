import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import psychologists from "../data/psychologists.json";
import { Psychologist } from "../types/psychologist";

export const fetchPsychologists = createAsyncThunk(
   "psychologists/fetchAll",
   async () => {
      return psychologists;
   }
);

const psychologistsSlice = createSlice({
   name: "psychologists",
   initialState: {
      list: [] as Psychologist[],
      status: "idle",
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchPsychologists.pending, (state) => {
            state.status = "loading";
         })
         .addCase(fetchPsychologists.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.list = action.payload.map((psychologist) => ({
               ...psychologist,
               experience: Number(psychologist.experience),
               pricePerSession: Number(psychologist.pricePerSession),
               methods: Array.isArray(psychologist.methods)
                  ? psychologist.methods
                  : [psychologist.methods],
            }));
         })

         .addCase(fetchPsychologists.rejected, (state, action) => {
            state.status = "failed";
            console.error("Ошибка загрузки данных:", action.error.message);
         });
   },
});

export default psychologistsSlice.reducer;
