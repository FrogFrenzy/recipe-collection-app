'use client';

import { useState, FormEvent } from 'react';
import { Recipe, RecipeCategory } from '@/lib/types';

interface RecipeFormProps {
  initialRecipe?: Recipe;
  onSubmit: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function RecipeForm({ initialRecipe, onSubmit, onCancel }: RecipeFormProps) {
  const [title, setTitle] = useState(initialRecipe?.title || '');
  const [category, setCategory] = useState<RecipeCategory>(initialRecipe?.category || 'dinner');
  const [prepTime, setPrepTime] = useState(initialRecipe?.prepTime.toString() || '');
  const [cookTime, setCookTime] = useState(initialRecipe?.cookTime.toString() || '');
  const [servings, setServings] = useState(initialRecipe?.servings.toString() || '');
  const [ingredients, setIngredients] = useState<string[]>(initialRecipe?.ingredients || ['']);
  const [instructions, setInstructions] = useState<string[]>(initialRecipe?.instructions || ['']);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Filter out empty ingredients and instructions
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

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

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

      {/* Title */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Recipe Title *
        </label>
        <input
          type="text"
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Chocolate Chip Cookies"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Category */}
      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          id="category"
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

      {/* Time and Servings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-2">
            Prep Time (min) *
          </label>
          <input
            type="number"
            id="prepTime"
            required
            min="0"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-2">
            Cook Time (min) *
          </label>
          <input
            type="number"
            id="cookTime"
            required
            min="0"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
            Servings *
          </label>
          <input
            type="number"
            id="servings"
            required
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ingredients *
        </label>
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

      {/* Instructions */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instructions *
        </label>
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

      {/* Form Actions */}
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