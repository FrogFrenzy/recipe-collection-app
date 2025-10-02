'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { Recipe, RecipeCategory } from '@/lib';

// Header Component
export function Header() {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">🍳 Recipe Collection</h1>
        </div>
      </div>
    </header>
  );
}

// SearchBar Component
interface SearchBarProps {
  searchQuery: string;
  selectedCategory: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
}

const categories: { value: string; label: string }[] = [
  { value: 'all', label: 'All Recipes' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'snack', label: 'Snack' },
];

export function SearchBar({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}: SearchBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
          />
        </div>
        <div className="md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition bg-white cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// RecipeCard Component
interface RecipeCardProps {
  recipe: Recipe;
  onView: (id: string) => void;
}

const categoryColors = {
  breakfast: 'bg-yellow-100 text-yellow-800',
  lunch: 'bg-green-100 text-green-800',
  dinner: 'bg-blue-100 text-blue-800',
  dessert: 'bg-pink-100 text-pink-800',
  snack: 'bg-purple-100 text-purple-800',
};

const categoryEmojis = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️',
  dessert: '🍰',
  snack: '🍿',
};

export function RecipeCard({ recipe, onView }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div 
      onClick={() => onView(recipe.id)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 h-full cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 flex-1 mr-2 line-clamp-2">
            {recipe.title}
          </h3>
          <span className="text-2xl flex-shrink-0">
            {categoryEmojis[recipe.category]}
          </span>
        </div>

        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryColors[recipe.category]}`}>
            {recipe.category}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="font-medium">⏱️</span>
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">🍽️</span>
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            {recipe.ingredients.length} ingredients · {recipe.instructions.length} steps
          </p>
        </div>
      </div>
    </div>
  );
}

// RecipeForm Component
interface RecipeFormProps {
  initialRecipe?: Recipe;
  onSubmit: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function RecipeForm({ initialRecipe, onSubmit, onCancel }: RecipeFormProps) {
  const [title, setTitle] = useState(initialRecipe?.title || '');
  const [category, setCategory] = useState<RecipeCategory>(initialRecipe?.category || 'dinner');
  const [prepTime, setPrepTime] = useState(initialRecipe?.prepTime.toString() || '');
  const [cookTime, setCookTime] = useState(initialRecipe?.cookTime.toString() || '');
  const [servings, setServings] = useState(initialRecipe?.servings.toString() || '');
  const [ingredients, setIngredients] = useState<string[]>(initialRecipe?.ingredients || ['']);
  const [instructions, setInstructions] = useState<string[]>(initialRecipe?.instructions || ['']);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const filteredIngredients = ingredients.filter(ing => ing.trim() !== '');
    const filteredInstructions = instructions.filter(inst => inst.trim() !== '');

    if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
      alert('Please add at least one ingredient and one instruction step.');
      return;
    }

    onSubmit({
      title,
      category,
      prepTime: parseInt(prepTime),
      cookTime: parseInt(cookTime),
      servings: parseInt(servings),
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
    });
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addInstruction = () => setInstructions([...instructions, '']);
  const removeInstruction = (index: number) => setInstructions(instructions.filter((_, i) => i !== index));
  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {initialRecipe ? 'Edit Recipe' : 'Add New Recipe'}
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Title *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Chocolate Chip Cookies"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value as RecipeCategory)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="dessert">Dessert</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (min) *</label>
          <input
            type="number"
            required
            min="0"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time (min) *</label>
          <input
            type="number"
            required
            min="0"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Servings *</label>
          <input
            type="number"
            required
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients *</label>
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="mt-3 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition font-medium"
        >
          + Add Ingredient
        </button>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Instructions *</label>
        <div className="space-y-2">
          {instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-shrink-0 w-8 h-12 flex items-center justify-center bg-orange-100 text-orange-700 rounded-lg font-bold">
                {index + 1}
              </div>
              <textarea
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                rows={2}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              />
              {instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addInstruction}
          className="mt-3 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition font-medium"
        >
          + Add Step
        </button>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
        >
          {initialRecipe ? 'Update Recipe' : 'Save Recipe'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}