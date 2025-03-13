// src/components/MealCard.tsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { CustomMealsContext } from "../context/CustomMealsContext";

interface MealCardProps {
  idMeal: string | undefined; // "52772" veya "custom-12345"
  strMeal: string; // Yemek adı
  strMealThumb?: string; // Resim URL
  strCategory?: string; // Kategori
  strArea?: string; // Bölge
  hideDelete?: boolean; // Favoritessayfasında mı? (sil butonunu gizle)
}

const MealCard: React.FC<MealCardProps> = ({
  idMeal,
  strMeal,
  strMealThumb,
  strCategory,
  strArea,
  hideDelete = false, // Default false
}) => {
  const { removeCustomMeal } = useContext(CustomMealsContext);
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // Bu yemek custom mı?
  const isCustom = idMeal?.startsWith("custom-") ?? false;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!idMeal) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete the dish named ${strMeal}?`
    );
    if (confirmed) {
      removeCustomMeal(idMeal);
    }
  };

  const handleCardClick = () => {
    if (!idMeal) return;
    navigate(`/meal/${idMeal}`);
  };

  const showNoImage = !strMealThumb || imgError;

  // Sil butonunu gösterme şartı: Hem custom olacak hem de hideDelete=false olacak
  const showDeleteButton = isCustom && !hideDelete;

  return (
    <div
      onClick={handleCardClick}
      className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer"
    >
      {showNoImage ? (
        <div className="w-full h-48 flex items-center justify-center bg-gray-300 dark:bg-gray-700">
          <span className="text-gray-700 dark:text-gray-300">No Image</span>
        </div>
      ) : (
        <img
          src={strMealThumb}
          alt={strMeal}
          className="w-full h-48 object-cover"
          onError={() => setImgError(true)}
        />
      )}

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold mb-2 line-clamp-1">{strMeal}</h2>

        {/* Kategori + Bölge solda */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-200">
            <span className="mr-3">
              <strong>Category:</strong> {strCategory || "N/A"}
            </span>
            <span>
              <strong>Origin:</strong> {strArea || "N/A"}
            </span>
          </div>

          {/* Butonlar: Favori + (opsiyonel) Sil */}
          <div className="flex items-center gap-4">
            <FavoriteButton mealId={idMeal ?? ""} />
            {showDeleteButton && (
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
