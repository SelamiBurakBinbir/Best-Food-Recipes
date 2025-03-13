import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import MealDetails from "./pages/MealDetails";
import Favorites from "./pages/Favorites";
import Search from "./pages/Search";
import AllMeals from "./pages/AllMeals";
import AddMeal from "./pages/AddMeal";
import MealPlanner from "./pages/MealPlanner";

import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import { CustomMealsProvider } from "./context/CustomMealsContext";
import { MealPlannerProvider } from "./context/MealPlannerContext";

const AppContent: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);

  // Set different background images for light and dark mode
  const backgroundImage = darkMode
    ? "url('/images/dark-background.jpg')"
    : "url('/images/light-background.jpg')";

  return (
    <div
      style={{ backgroundImage }}
      className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen transition-colors flex flex-col"
    >
      <FavoritesProvider>
        <CustomMealsProvider>
          <MealPlannerProvider>
            <Router>
              <Header />
              <div className="flex-1 w-full p-4">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/meal/:id" element={<MealDetails />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/all-meals" element={<AllMeals />} />
                  <Route path="/add-meal" element={<AddMeal />} />
                  <Route path="/meal-planner" element={<MealPlanner />} />
                </Routes>
              </div>
            </Router>
          </MealPlannerProvider>
        </CustomMealsProvider>
      </FavoritesProvider>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
