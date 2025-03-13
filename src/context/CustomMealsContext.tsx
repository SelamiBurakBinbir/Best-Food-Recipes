//src/context/CustomMealsContext.tsx
import React, { createContext, useState, useEffect } from "react";

export interface CustomMeal {
  id: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strIngredients: string; // <-- Yeni eklenen alan
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
}

interface CustomMealsContextType {
  customMeals: CustomMeal[];
  addCustomMeal: (mealData: Omit<CustomMeal, "id">) => void;
  removeCustomMeal: (id: string) => void;
}

export const CustomMealsContext = createContext<CustomMealsContextType>({
  customMeals: [],
  addCustomMeal: () => {},
  removeCustomMeal: () => {},
});

export const CustomMealsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [customMeals, setCustomMeals] = useState<CustomMeal[]>(() => {
    const stored = localStorage.getItem("customMeals");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("customMeals", JSON.stringify(customMeals));
  }, [customMeals]);

  const addCustomMeal = (mealData: Omit<CustomMeal, "id">) => {
    const newMeal: CustomMeal = {
      id: "custom-" + Date.now().toString(),
      ...mealData,
    };
    setCustomMeals((prev) => [...prev, newMeal]);
  };

  const removeCustomMeal = (id: string) => {
    setCustomMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  return (
    <CustomMealsContext.Provider
      value={{ customMeals, addCustomMeal, removeCustomMeal }}
    >
      {children}
    </CustomMealsContext.Provider>
  );
};
