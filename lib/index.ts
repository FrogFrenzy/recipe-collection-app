// Types
export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack';

export interface Recipe {
  id: string;
  title: string;
  category: RecipeCategory;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  ingredients: string[];
  instructions: string[];
  createdAt: string;
  updatedAt: string;
}

// Storage functions
const STORAGE_KEY = 'recipes';

export function getRecipes(): Recipe[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading recipes from localStorage:', error);
    return [];
  }
}

export function getRecipeById(id: string): Recipe | null {
  const recipes = getRecipes();
  return recipes.find(recipe => recipe.id === id) || null;
}

export function saveRecipes(recipes: Recipe[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving recipes to localStorage:', error);
  }
}

export function addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Recipe {
  const recipes = getRecipes();
  const newRecipe: Recipe = {
    ...recipe,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  recipes.push(newRecipe);
  saveRecipes(recipes);
  return newRecipe;
}

export function updateRecipe(id: string, updates: Partial<Omit<Recipe, 'id' | 'createdAt'>>): Recipe | null {
  const recipes = getRecipes();
  const index = recipes.findIndex(recipe => recipe.id === id);

  if (index === -1) return null;

  const updatedRecipe: Recipe = {
    ...recipes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  recipes[index] = updatedRecipe;
  saveRecipes(recipes);
  return updatedRecipe;
}

export function deleteRecipe(id: string): boolean {
  const recipes = getRecipes();
  const filtered = recipes.filter(recipe => recipe.id !== id);

  if (filtered.length === recipes.length) return false;

  saveRecipes(filtered);
  return true;
}

export function searchRecipes(query: string): Recipe[] {
  const recipes = getRecipes();
  const lowerQuery = query.toLowerCase();
  return recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(lowerQuery)
  );
}

export function filterRecipesByCategory(category: string): Recipe[] {
  if (category === 'all') return getRecipes();
  const recipes = getRecipes();
  return recipes.filter(recipe => recipe.category === category);
}