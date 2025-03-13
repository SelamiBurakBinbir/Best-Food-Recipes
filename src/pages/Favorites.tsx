// src/pages/Favorites.tsx
import React, { useContext, useEffect, useState } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { CustomMealsContext } from "../context/CustomMealsContext";
import MealCard from "../components/MealCard";

const Favorites: React.FC = () => {
  const { favorites } = useContext(FavoritesContext);
  const { customMeals } = useContext(CustomMealsContext);

  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    if (favorites.length === 0) {
      // Favori yoksa liste boş
      setMeals([]);
      return;
    }

    // Hem API hem custom'ı birlikte çek
    Promise.all(
      favorites.map(async (favId) => {
        // custom- ile başlıyorsa customMeals'tan bul
        if (favId.startsWith("custom-")) {
          const foundCustom = customMeals.find((cm) => cm.id === favId);
          return foundCustom || null;
        } else {
          // Yoksa API'den çek
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${favId}`
          );
          const data = await res.json();
          return data.meals?.[0] || null;
        }
      })
    ).then((results) => {
      const validMeals = results.filter((m) => m !== null);
      setMeals(validMeals);
    });
  }, [favorites, customMeals]);

  // Eğer favoriler dizisi baştan boşsa
  if (favorites.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Favorite Recipes</h2>
        <p className="text-red-500 mt-2 font-bold">
          You haven't added any favorites.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Favorite Recipes</h2>

      {/* Eğer API'den çekilen meals de boşsa */}
      {meals.length === 0 ? (
        <p className="text-gray-500 mt-2">Loading favorites...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {meals.map((meal, i) => {
            const mealId = meal.idMeal || meal.id;
            return (
              <MealCard
                key={mealId + i}
                idMeal={mealId}
                strMeal={meal.strMeal}
                strMealThumb={meal.strMealThumb}
                strCategory={meal.strCategory}
                strArea={meal.strArea}
                hideDelete={true} // <-- FAVORİLERDEYKEN SİL BUTONU GÖRÜNMEZ
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;
