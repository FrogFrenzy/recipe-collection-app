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