//src/pages/AddMeal.tsx
import React, { useState, useContext } from "react";
import { CustomMealsContext } from "../context/CustomMealsContext";
import { useNavigate } from "react-router-dom";

const AddMeal: React.FC = () => {
  const { addCustomMeal } = useContext(CustomMealsContext);
  const navigate = useNavigate();

  // Yeni eklediğimiz state:
  const [strMeal, setStrMeal] = useState("");
  const [strCategory, setStrCategory] = useState("");
  const [strArea, setStrArea] = useState("");
  const [strIngredients, setStrIngredients] = useState(""); // <-- Eklendi
  const [strInstructions, setStrInstructions] = useState("");
  const [strMealThumb, setStrMealThumb] = useState("");
  const [strYoutube, setStrYoutube] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!strMeal) {
      alert("The meal name is mandatory!");
      return;
    }

    // Yeni eklenen strIngredients da burada ekleniyor
    addCustomMeal({
      strMeal,
      strCategory,
      strArea,
      strIngredients,
      strInstructions,
      strMealThumb,
      strYoutube,
    });

    // Tüm inputları sıfırlıyoruz
    setStrMeal("");
    setStrCategory("");
    setStrArea("");
    setStrIngredients(""); // <-- Sıfırlama
    setStrInstructions("");
    setStrMealThumb("");
    setStrYoutube("");

    navigate("/all-meals");
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add Your Own Recipe
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block font-semibold">
              Recipe Name (required)
            </label>
            <input
              type="text"
              className="border border-gray-500/50 focus:outline-none w-full p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={strMeal}
              onChange={(e) => setStrMeal(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold">Category</label>
            <input
              type="text"
              className="border border-gray-500/50 focus:outline-none w-full p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={strCategory}
              onChange={(e) => setStrCategory(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold">Origin</label>
            <input
              type="text"
              className="border border-gray-500/50 focus:outline-none w-full p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={strArea}
              onChange={(e) => setStrArea(e.target.value)}
            />
          </div>
          {/* Ingredients alanı bölge ve talimatlar arasına eklendi */}
          <div>
            <label className="block font-semibold">Ingredients</label>
            <textarea
              className="border border-gray-500/50 focus:outline-none w-full p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={strIngredients}
              onChange={(e) => setStrIngredients(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold">Instructions</label>
            <textarea
              className="border border-gray-500/50 focus:outline-none w-full p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={strInstructions}
              onChange={(e) => setStrInstructions(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold">Recipe Image URL</label>
            <input
              type="text"
              className="border border-gray-500/50 focus:outline-none w-full p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={strMealThumb}
              onChange={(e) => setStrMealThumb(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold">YouTube Link</label>
            <input
              type="text"
              className="border border-gray-500/50 focus:outline-none w-full p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={strYoutube}
              onChange={(e) => setStrYoutube(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMeal;
