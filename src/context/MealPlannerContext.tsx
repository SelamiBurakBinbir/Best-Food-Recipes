//src/context/MealPlannerContext.tsx
import React, { createContext, useEffect, useState } from "react";
import { MealOrCustomMeal } from "../types";

interface PlannerData {
  [dateKey: string]: MealOrCustomMeal[];
}

interface MealPlannerContextType {
  planner: PlannerData;
  addMealToPlanner: (dateKey: string, meal: MealOrCustomMeal) => void;
  removeMealFromPlanner: (dateKey: string, mealId: string) => void; // <-- ekledik
}

export const MealPlannerContext = createContext<MealPlannerContextType>({
  planner: {},
  addMealToPlanner: () => {},
  removeMealFromPlanner: () => {},
});

export const MealPlannerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [planner, setPlanner] = useState<PlannerData>(() => {
    const stored = localStorage.getItem("mealPlanner");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem("mealPlanner", JSON.stringify(planner));
  }, [planner]);

  const addMealToPlanner = (dateKey: string, meal: MealOrCustomMeal) => {
    setPlanner((prev) => {
      const existingMeals = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: [...existingMeals, meal],
      };
    });
  };

  // Silme fonksiyonu
  const removeMealFromPlanner = (dateKey: string, mealId: string) => {
    setPlanner((prev) => {
      const existingMeals = prev[dateKey] || [];
      // mealOrCustomMeal içinden ID'si mealId olanı çıkar
      const updatedMeals = existingMeals.filter((m) => {
        const mId = "idMeal" in m ? m.idMeal : m.id; // custom-xxx
        return mId !== mealId;
      });
      return {
        ...prev,
        [dateKey]: updatedMeals,
      };
    });
  };

  return (
    <MealPlannerContext.Provider
      value={{ planner, addMealToPlanner, removeMealFromPlanner }}
    >
      {children}
    </MealPlannerContext.Provider>
  );
};
