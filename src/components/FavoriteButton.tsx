//src/components/FavoriteButton.tsx
import React, { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";

interface FavoriteButtonProps {
  mealId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ mealId }) => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const isFavorite = favorites.includes(mealId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(mealId);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        p-2 rounded-full text-lg transition-colors duration-200
        ${
          isFavorite
            ? "text-red-500 bg-red-100 hover:bg-red-200 dark:bg-red-800"
            : "text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700"
        }
      `}
      style={{ width: "40px", height: "40px" }}
    >
      {isFavorite ? "❤️" : "🤍"}
    </button>
  );
};

export default FavoriteButton;
