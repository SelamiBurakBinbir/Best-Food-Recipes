// src/components/Header.tsx
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  // Ortak stil sınıfları
  const baseClass =
    "px-3 py-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-700";

  return (
    <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center transition-colors">
      <div className="flex items-center gap-4">
        {/* API, GitHub, LinkedIn Butonları */}
        <a
          href="https://www.themealdb.com/api.php"
          className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/images/api.png"
            alt="API"
            className="w-6 h-6 inline-block"
          />
        </a>
        <a
          href="https://github.com/SelamiBurakBinbir"
          className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/images/github.png"
            alt="github"
            className="w-6 h-6 inline-block"
          />
        </a>
        <a
          href="https://www.linkedin.com/in/selami-burak-binbir-746761234/"
          className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/images/linkedin.png"
            alt="linkedin"
            className="w-6 h-6 inline-block"
          />
        </a>

        {/* Logo */}
        <h1 className="text-xl font-bold">
          <NavLink to="/" className="text-2xl hover:underline">
            Best Food Recipes
          </NavLink>
        </h1>
      </div>

      <nav className="flex items-center gap-4">
        {/** Her bir link için active kontrolü sağlıyoruz */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? "bg-gray-200 dark:bg-gray-700" : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? "bg-gray-200 dark:bg-gray-700" : ""}`
          }
        >
          Search
        </NavLink>
        <NavLink
          to="/all-meals"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? "bg-gray-200 dark:bg-gray-700" : ""}`
          }
        >
          All Recipes
        </NavLink>
        <NavLink
          to="/add-meal"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? "bg-gray-200 dark:bg-gray-700" : ""}`
          }
        >
          Add Recipe
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? "bg-gray-200 dark:bg-gray-700" : ""}`
          }
        >
          Favorites
        </NavLink>
        <NavLink
          to="/meal-planner"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? "bg-gray-200 dark:bg-gray-700" : ""}`
          }
        >
          Calendar
        </NavLink>

        {/* Tema Butonu */}
        <button
          onClick={toggleDarkMode}
          className="w-32 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </nav>
    </header>
  );
};

export default Header;
