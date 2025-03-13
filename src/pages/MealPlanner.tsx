// src/pages/MealPlanner.tsx
import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

import { MealPlannerContext } from "../context/MealPlannerContext";
import { FavoritesContext } from "../context/FavoritesContext";
import { CustomMealsContext } from "../context/CustomMealsContext";
import { MealOrCustomMeal } from "../types";

/** Lokal saati baz alarak YYYY-MM-DD döndürür */
function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const MealPlanner: React.FC = () => {
  const navigate = useNavigate();
  const { planner, addMealToPlanner, removeMealFromPlanner } =
    useContext(MealPlannerContext);
  const { favorites } = useContext(FavoritesContext);
  const { customMeals } = useContext(CustomMealsContext);

  // Varsayılan tarih
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [favOpen, setFavOpen] = useState(false);

  // Planner değişince tekrar render al
  useEffect(() => {
    setSelectedDate((prev) => new Date(prev));
  }, [planner]);

  // Formatlı tarih
  const dateKey = formatDateLocal(selectedDate);

  // O güne eklenen yemekler
  const dayMeals = planner[dateKey] || [];

  // Favoriler (API + custom)
  const [favoriteMeals, setFavoriteMeals] = useState<MealOrCustomMeal[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const results: MealOrCustomMeal[] = [];
      for (const favId of favorites) {
        if (favId.startsWith("custom-")) {
          const foundCustom = customMeals.find((cm) => cm.id === favId);
          if (foundCustom) results.push(foundCustom);
        } else {
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${favId}`
          );
          const data = await res.json();
          if (data.meals && data.meals[0]) {
            results.push(data.meals[0]);
          }
        }
      }
      setFavoriteMeals(results);
    };
    fetchFavorites();
  }, [favorites, customMeals]);

  // Rastgele ekle (aynı ID'yi tekrar eklememek için kontrol)
  const handleAddRandom = async () => {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await res.json();
    if (data.meals && data.meals[0]) {
      const newMeal = data.meals[0];
      const newMealId = "idMeal" in newMeal ? newMeal.idMeal : newMeal.id;
      const already = dayMeals.some((m) => {
        const mId = "idMeal" in m ? m.idMeal : m.id;
        return mId === newMealId;
      });
      if (!already) {
        addMealToPlanner(dateKey, newMeal);
      }
    }
  };

  // Favorilerden ekle
  const handleAddFavorite = (meal: MealOrCustomMeal) => {
    const mealId = "idMeal" in meal ? meal.idMeal : meal.id;
    const already = dayMeals.some((m) => {
      const mId = "idMeal" in m ? m.idMeal : m.id;
      return mId === mealId;
    });
    if (!already) {
      addMealToPlanner(dateKey, meal);
    }
    setFavOpen(false); // details kapat
  };

  const handleMealClick = (meal: MealOrCustomMeal) => {
    const mealId = "idMeal" in meal ? meal.idMeal : meal.id;
    navigate(`/meal/${mealId}`);
  };

  const handleRemoveMeal = (
    e: React.MouseEvent<HTMLButtonElement>,
    meal: MealOrCustomMeal
  ) => {
    e.stopPropagation();
    const mealId = "idMeal" in meal ? meal.idMeal : meal.id;
    removeMealFromPlanner(dateKey, mealId);
  };

  return (
    <div className="flex w-full gap-6 p-4 justify-center items-start">
      {/* Takvim */}
      <div>
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          className="react-calendar-custom"
        />
      </div>

      {/* Sadece Meal Planner kısmı için arka plan */}
      <div
        className="w-[500px] max-h-[400px] overflow-auto p-4 border border-gray-300 dark:border-gray-600 rounded 
                      bg-gray-50 dark:bg-gray-800"
      >
        <h2 className="text-2xl font-bold mb-2">Meal Planner</h2>
        <p className="font-semibold mb-4">Selected Date: {dateKey}</p>

        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={handleAddRandom}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition-colors"
          >
            Add Random
          </button>

          <details
            open={favOpen}
            onToggle={(e) => setFavOpen(e.currentTarget.open)}
            className="relative"
          >
            <summary className="cursor-pointer bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors">
              Add from Favorites
            </summary>
            <div className="absolute bg-white dark:bg-gray-700 p-2 mt-1 rounded w-48 shadow z-10">
              {favoriteMeals.length === 0 && (
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  No favorites added yet.
                </p>
              )}
              {favoriteMeals.map((fav, i) => (
                <button
                  key={i}
                  onClick={() => handleAddFavorite(fav)}
                  className="block w-full text-left text-sm px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                >
                  {fav.strMeal}
                </button>
              ))}
            </div>
          </details>
        </div>

        <div className="space-y-2">
          {dayMeals.map((meal, idx) => (
            <div
              key={idx}
              onClick={() => handleMealClick(meal)}
              className="border p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 flex items-center justify-between transition-colors"
            >
              <span>{meal.strMeal}</span>
              <button
                onClick={(e) => handleRemoveMeal(e, meal)}
                className="bg-red-500 text-white text-sm px-4 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
          {dayMeals.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              There is no dish attached to this day.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
