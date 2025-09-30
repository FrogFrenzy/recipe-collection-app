'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import RecipeForm from '@/components/RecipeForm';
import { Recipe } from '@/lib/types';
import { getRecipeById, updateRecipe, deleteRecipe } from '@/lib/storage';

const categoryEmojis = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️',
  dessert: '🍰',
  snack: '🍿',
};

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadedRecipe = getRecipeById(id);
    if (!loadedRecipe) {
      router.push('/');
      return;
    }
    setRecipe(loadedRecipe);
  }, [id, router]);

  const handleUpdate = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updated = updateRecipe(id, recipeData);
    if (updated) {
      setRecipe(updated);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    const success = deleteRecipe(id);
    if (success) {
      router.push('/');
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <RecipeForm
            initialRecipe={recipe}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </main>
      </div>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Recipe Header */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
                <div className="flex items-center gap-6 text-orange-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <span>Total: {totalTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👨‍🍳</span>
                    <span>Prep: {recipe.prepTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <span>Cook: {recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍽️</span>
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>
              </div>
              <span className="text-6xl">{categoryEmojis[recipe.category]}</span>
            </div>
          </div>

          {/* Recipe Content */}
          <div className="p-8">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold uppercase">
                {recipe.category}
              </span>
            </div>

            {/* Ingredients */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📝</span> Ingredients
              </h2>
              <div className="bg-orange-50 rounded-lg p-6">
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-orange-500 mt-1">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>👩‍🍳</span> Instructions
              </h2>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 flex-1 pt-1">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
              >
                ✏️ Edit Recipe
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition shadow-md"
              >
                🗑️ Delete
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Delete Recipe?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{recipe.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}