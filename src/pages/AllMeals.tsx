// src/pages/AllMeals.tsx
import React, { useState, useEffect, useContext } from "react";
import MealCard from "../components/MealCard";
import { CustomMealsContext } from "../context/CustomMealsContext";
import { ApiMeal, MealOrCustomMeal } from "../types";

interface Category {
  strCategory: string;
}
interface Area {
  strArea: string;
}
interface IngredientApi {
  strIngredient: string;
}

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

const AllMeals: React.FC = () => {
  const { customMeals } = useContext(CustomMealsContext);

  const [viewMode, setViewMode] = useState<string>("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [ingredients, setIngredients] = useState<IngredientApi[]>([]);

  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const [apiMeals, setApiMeals] = useState<ApiMeal[]>([]);
  const [combinedMeals, setCombinedMeals] = useState<MealOrCustomMeal[]>([]);

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));

    fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
      .then((res) => res.json())
      .then((data) => setAreas(data.meals || []));

    fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
      .then((res) => res.json())
      .then((data) => setIngredients(data.meals || []));
  }, []);

  useEffect(() => {
    if (viewMode === "custom") {
      if (customMeals.length === 0) {
        setCombinedMeals([]);
        return;
      }
      setCombinedMeals([...customMeals]);
      return;
    }

    if (!viewMode) {
      setApiMeals([]);
      setCombinedMeals([]);
      return;
    }

    let url = "";
    let needsDetailFetch = false;

    if (viewMode === "alphabetic" && selectedLetter) {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${selectedLetter}`;
    }
    if (viewMode === "category" && selectedCategory) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
      needsDetailFetch = true;
    }
    if (viewMode === "area" && selectedArea) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`;
      needsDetailFetch = true;
    }
    if (viewMode === "ingredient" && selectedIngredient) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${selectedIngredient}`;
      needsDetailFetch = true;
    }

    if (!url) {
      setApiMeals([]);
      setCombinedMeals([]);
      return;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals) {
          if (needsDetailFetch) {
            const mealIds = data.meals.map((m: any) => m.idMeal);
            Promise.all(
              mealIds.map((mealId: string) =>
                fetch(
                  `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
                )
                  .then((r) => r.json())
                  .then((d) => (d.meals ? d.meals[0] : null))
              )
            ).then((detailedMeals) => {
              combineMeals(detailedMeals.filter(Boolean) as ApiMeal[]);
            });
          } else {
            combineMeals(data.meals);
          }
        } else {
          combineMeals([]);
        }
      });
  }, [
    viewMode,
    selectedLetter,
    selectedCategory,
    selectedArea,
    selectedIngredient,
    customMeals,
  ]);

  const combineMeals = (apiData: ApiMeal[]) => {
    let filteredCustom = [...customMeals];

    if (viewMode === "alphabetic" && selectedLetter) {
      filteredCustom = filteredCustom.filter((cm) =>
        cm.strMeal.toLowerCase().startsWith(selectedLetter)
      );
    }
    if (viewMode === "category" && selectedCategory) {
      filteredCustom = filteredCustom.filter(
        (cm) => cm.strCategory === selectedCategory
      );
    }
    if (viewMode === "area" && selectedArea) {
      filteredCustom = filteredCustom.filter(
        (cm) => cm.strArea === selectedArea
      );
    }
    if (viewMode === "ingredient" && selectedIngredient) {
      filteredCustom = filteredCustom.filter((cm) =>
        (cm as any).ingredients?.some(
          (ing: string) => ing === selectedIngredient
        )
      );
    }

    setApiMeals(apiData);
    setCombinedMeals([...apiData, ...filteredCustom]);
  };

  const handleViewMode = (mode: string) => {
    setViewMode(mode);
    setSelectedLetter("");
    setSelectedCategory("");
    setSelectedArea("");
    setSelectedIngredient("");
    setApiMeals([]);
    setCombinedMeals([]);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">All Recipes</h2>

      {/* Filtre Butonları */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleViewMode("custom")}
          className={`px-4 py-2 rounded transition-colors
            ${
              viewMode === "custom"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            }
          `}
        >
          Your Recipes
        </button>
        <button
          onClick={() => handleViewMode("alphabetic")}
          className={`px-4 py-2 rounded transition-colors
            ${
              viewMode === "alphabetic"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            }
          `}
        >
          Alphabetical
        </button>
        <button
          onClick={() => handleViewMode("category")}
          className={`px-4 py-2 rounded transition-colors
            ${
              viewMode === "category"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            }
          `}
        >
          Categories
        </button>
        <button
          onClick={() => handleViewMode("area")}
          className={`px-4 py-2 rounded transition-colors
            ${
              viewMode === "area"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            }
          `}
        >
          Origin
        </button>
        <button
          onClick={() => handleViewMode("ingredient")}
          className={`px-4 py-2 rounded transition-colors
            ${
              viewMode === "ingredient"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            }
          `}
        >
          Ingredients
        </button>
      </div>

      {/* Alfabetik Seçenek */}
      {viewMode === "alphabetic" && (
        <div className="flex flex-wrap gap-2">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`border border-gray-500/50 focus:outline-none px-2 py-1 rounded transition-colors
                ${
                  selectedLetter === letter
                    ? "bg-blue-200 dark:bg-blue-800 text-black dark:text-white"
                    : "bg-gray-50 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                }
              `}
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Kategori Seçimi */}
      {viewMode === "category" && (
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-500/50 focus:outline-none p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Chose Category</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat.strCategory}>
              {cat.strCategory}
            </option>
          ))}
        </select>
      )}

      {/* Bölge Seçimi */}
      {viewMode === "area" && (
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="border border-gray-500/50 focus:outline-none p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Chose Origin</option>
          {areas.map((ar, idx) => (
            <option key={idx} value={ar.strArea}>
              {ar.strArea}
            </option>
          ))}
        </select>
      )}

      {/* Ingredient Seçimi */}
      {viewMode === "ingredient" && (
        <select
          value={selectedIngredient}
          onChange={(e) => setSelectedIngredient(e.target.value)}
          className="border border-gray-500/50 focus:outline-none p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Chose Ingredient</option>
          {ingredients.map((ing, idx) => (
            <option key={idx} value={ing.strIngredient}>
              {ing.strIngredient}
            </option>
          ))}
        </select>
      )}

      {viewMode === "custom" && customMeals.length === 0 && (
        <p className="text-red-500 font-bold">
          You haven't added any recipes yet.
        </p>
      )}

      {/* Yemek Kartları LİSTE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {combinedMeals.map((meal, i) => {
          const mealId = "idMeal" in meal ? meal.idMeal : meal.id;
          const mealName = meal.strMeal;
          const thumb = meal.strMealThumb || "";
          const cat = meal.strCategory || "";
          const area = meal.strArea || "";

          return (
            <MealCard
              key={mealId + i}
              idMeal={mealId}
              strMeal={mealName}
              strMealThumb={thumb}
              strCategory={cat}
              strArea={area}
              hideDelete={false} // <-- BURADA SİL BUTONUNU GÖSTER (varsayılan)
            />
          );
        })}
      </div>
    </div>
  );
};

export default AllMeals;
