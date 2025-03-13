// src/pages/Search.tsx
import React, { useState, useEffect } from "react";
import MealCard from "../components/MealCard";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setMeals(data.meals || []);
        setSearched(true);
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Search Recipe</h2>

      {/* DÜZENLENMİŞ ARAMA FORMU */}
      <form onSubmit={handleSearch} className="flex w-full mb-4">
        <input
          type="text"
          placeholder="Search for a recipe..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
          flex-grow px-4 py-2
          border border-gray-300 dark:border-gray-600
          bg-gray-50 dark:bg-gray-700
          text-black dark:text-white
          rounded-l-xl focus:outline-none focus:ring-2 focus:ring-gray-500
          transition-colors
        "
        />
        <button
          type="submit"
          className="
          bg-blue-500 text-white px-4 py-2
          rounded-r-xl hover:bg-blue-600 transition-colors
        "
        >
          Search
        </button>
      </form>

      {/* Arama yapıldıysa ama sonuç yoksa hata mesajı */}
      {searched && meals.length === 0 && (
        <p className="text-red-500 font-bold">
          The food you are looking for was not found.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {meals.map((meal) => (
          <MealCard
            key={meal.idMeal}
            idMeal={meal.idMeal}
            strMeal={meal.strMeal}
            strMealThumb={meal.strMealThumb}
            strCategory={meal.strCategory}
            strArea={meal.strArea}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
