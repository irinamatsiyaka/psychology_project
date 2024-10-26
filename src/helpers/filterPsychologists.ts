import { Psychologist } from "../types/psychologist";

interface Filters {
   specialization: string;
   minExperience: number;
   maxPrice: number;
   location: string;
}

export const filterPsychologists = (
   psychologists: Psychologist[],
   filters: Filters
): Psychologist[] => {
   return psychologists.filter((psychologist) => {
      const matchesSpecialization =
         filters.specialization === "" ||
         psychologist.specialization === filters.specialization;

      const matchesExperience =
         psychologist.experience >= filters.minExperience;

      const matchesPrice = psychologist.pricePerSession <= filters.maxPrice;

      const matchesLocation =
         filters.location === "" ||
         psychologist.location
            .toLowerCase()
            .includes(filters.location.toLowerCase());

      return (
         matchesSpecialization &&
         matchesExperience &&
         matchesPrice &&
         matchesLocation
      );
   });
};
