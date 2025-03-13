// src/pages/MealDetails.tsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton";
import { CustomMealsContext } from "../context/CustomMealsContext";
import { ApiMeal, CustomMeal } from "../types";

type MealState = ApiMeal | CustomMeal | null;
type LoadState = "loading" | "notfound" | "done";

const MealDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { customMeals } = useContext(CustomMealsContext);

  const [meal, setMeal] = useState<MealState>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    if (!id) {
      setLoadState("notfound");
      return;
    }

    // Eğer "custom-" ile başlıyorsa Custom Meal
    if (id.startsWith("custom-")) {
      const found = customMeals.find((m) => m.id === id);
      if (found) {
        setMeal(found);
        setLoadState("done");
      } else {
        setMeal(null);
        setLoadState("notfound");
      }
    } else {
      // API'den çek
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.meals && data.meals[0]) {
            setMeal(data.meals[0]);
            setLoadState("done");
          } else {
            setMeal(null);
            setLoadState("notfound");
          }
        })
        .catch(() => {
          setMeal(null);
          setLoadState("notfound");
        });
    }
  }, [id, customMeals]);

  if (loadState === "loading") {
    return <div className="text-center p-4">Yükleniyor...</div>;
  }
  if (loadState === "notfound" || !meal) {
    return <div className="text-center p-4">Yemek bulunamadı.</div>;
  }

  // Ortak veriler
  const mealId = "idMeal" in meal ? meal.idMeal : meal.id;
  const mealName = meal.strMeal;
  const mealThumb = meal.strMealThumb;
  const category = meal.strCategory;
  const area = meal.strArea;
  const instructions = meal.strInstructions;
  const youtube = meal.strYoutube;

  // API meal'lerinden gelen malzemeler (1-20 arası)
  const ingredientsList: { measure: string; ingredient: string }[] = [];
  if ("idMeal" in meal) {
    for (let i = 1; i <= 20; i++) {
      const ingKey = `strIngredient${i}` as keyof ApiMeal;
      const measureKey = `strMeasure${i}` as keyof ApiMeal;

      const ingredient = meal[ingKey];
      const measure = meal[measureKey];
      if (ingredient && ingredient.trim() !== "") {
        ingredientsList.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : "",
        });
      }
    }
  }

  // API'den gelen malzemeleri virgül şeklinde listelemek
  const ingredientsParagraph = ingredientsList.map((item, idx) => (
    <React.Fragment key={idx}>
      {item.measure} {item.ingredient}
      {idx < ingredientsList.length - 1 && ", "}
    </React.Fragment>
  ));

  // Malzemeler bölümünü API ve Custom'a göre ayırıyoruz
  let ingredientsContent = null;

  // API'den gelen yemek
  if ("idMeal" in meal) {
    if (ingredientsList.length > 0) {
      ingredientsContent = (
        <div className="mt-4">
          <h3 className="font-semibold text-xl">Ingredients:</h3>
          <p className="text-sm leading-6 mt-2">{ingredientsParagraph}</p>
        </div>
      );
    }
  } else {
    // Custom (kullanıcının eklediği) yemek
    if (meal.strIngredients && meal.strIngredients.trim().length > 0) {
      ingredientsContent = (
        <div className="mt-4">
          <h3 className="font-semibold text-xl">Ingredients:</h3>
          {/* Kullanıcı metni birden çok satır girebilir diye whitespace-pre-line */}
          <p className="text-sm leading-6 mt-2 whitespace-pre-line">
            {meal.strIngredients}
          </p>
        </div>
      );
    }
  }

  return (
    <div className="relative max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <div className="flex">
        {/* Fotoğraf (sol üstte), sabit 300x300 px */}
        <div className="w-[300px] h-[300px]">
          {mealThumb ? (
            <img
              src={mealThumb}
              alt={mealName}
              className="w-[300px] h-[300px] object-cover rounded"
            />
          ) : (
            <div className="w-[300px] h-[300px] bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded">
              <span className="text-gray-700 dark:text-gray-300">No Image</span>
            </div>
          )}
        </div>

        {/* Sağ taraf: Başlık, Favori butonu, Kategori ve Bölge */}
        <div className="flex flex-col ml-4 flex-1">
          {/* Üst satır: Başlık ve favori butonu */}
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold">{mealName}</h2>

            {/* Favori butonunu her iki türde de gösteriyoruz */}
            <div className="text-2xl ml-4">
              <FavoriteButton mealId={mealId} />
            </div>
          </div>

          {/* Kategori ve Bölge */}
          <div className="flex flex-col items-start mt-4">
            <p className="text-lg">
              <strong>Category:</strong> {category || "N/A"}
            </p>
            <p className="text-lg mt-2">
              <strong>Origin:</strong> {area || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Malzemeler */}
      {ingredientsContent}

      {/* Talimatlar */}
      <div className="mt-6">
        <h3 className="font-semibold text-xl">Instructions:</h3>
        <p className="whitespace-pre-line text-sm mt-2">
          {instructions || "—"}
        </p>
      </div>

      {/* YouTube Linki */}
      {youtube && (
        <div className="mt-6">
          <a
            href={youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Watch on YouTube
          </a>
        </div>
      )}
    </div>
  );
};

export default MealDetails;
