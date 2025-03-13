// src/types.ts

export interface ApiMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb?: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
}

export interface CustomMeal {
  id: string; // "custom-xxxx"
  strMeal: string;
  strMealThumb?: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;

  // Kullanıcıdan alınan malzemeleri tek paragraflık bir string olarak tutuyoruz
  strIngredients?: string;
}

export type MealOrCustomMeal = ApiMeal | CustomMeal;
