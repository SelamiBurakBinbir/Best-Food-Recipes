// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import MealCard from "../components/MealCard";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
}

const Home: React.FC = () => {
  const [randomMeal, setRandomMeal] = useState<Meal | null>(null);

  const fetchRandomMeal = () => {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((res) => res.json())
      .then((data) => {
        setRandomMeal(data.meals[0]);
      });
  };

  useEffect(() => {
    fetchRandomMeal();
  }, []);

  return (
    <div className="flex gap-6">
      {/* Sol sütun: Tanıtım */}
      <div className="w-2/3">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Best Food Recipes!
        </h1>

        <p className="text-xl dark:text-gray-200 leading-relaxed mb-4 font-bold">
          🍽️ This platform is designed to make your cooking journey fun and
          hassle-free. You can explore recipes from all over the world, create
          your own dishes, save your favorites, and even plan your meals for the
          week—all in one place!
        </p>

        <ul className="list-disc list-inside dark:text-gray-200 leading-relaxed font-bold">
          <li>
            🏠 <strong>Home</strong>: Discover a random meal suggestion to spark
            your culinary inspiration right away.
          </li>
          <li>
            🔍 <strong>Search</strong>: Quickly look up any recipe by name and
            get instant results, complete with mouthwatering images.
          </li>
          <li>
            📖 <strong>All Recipes</strong>: Browse an extensive list of recipes
            or filter them by category, origin, or ingredient to find the
            perfect dish.
          </li>
          <li>
            📝 <strong>Add Recipe</strong>: Add your own creations to your
            recipe book. Input ingredients, instructions, and an optional photo
            to showcase your masterpiece.
          </li>
          <li>
            ❤️ <strong>Favorites</strong>: Keep track of your most-loved dishes
            so you can revisit them anytime with just a click.
          </li>
          <li>
            🗓️ <strong>Calendar</strong>: Organize your daily or weekly menus by
            adding favorite or random recipes to specific dates. Perfect for
            staying on top of your meal prep!
          </li>
        </ul>

        <p className="text-xl dark:text-gray-200 leading-relaxed mt-4 font-bold">
          Get ready to embark on a flavorful journey and discover endless
          cooking possibilities!
        </p>
      </div>

      {/* Sağ sütun: Rastgele Yemek Önerisi */}
      <div className="w-1/3">
        <h2 className="text-xl font-bold mb-4">Today's Food for You:</h2>
        {randomMeal && (
          <MealCard
            idMeal={randomMeal.idMeal}
            strMeal={randomMeal.strMeal}
            strMealThumb={randomMeal.strMealThumb}
            strCategory={randomMeal.strCategory}
            strArea={randomMeal.strArea}
          />
        )}

        {/* Butonu sağa al */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={fetchRandomMeal}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
