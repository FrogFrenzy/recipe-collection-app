'use client';

import { useState, useEffect } from 'react';
import { Header, SearchBar, RecipeCard, RecipeForm } from '@/components';
import { Recipe, getRecipes, addRecipe, updateRecipe, deleteRecipe, getRecipeById } from '@/lib';

type View = 'list' | 'add' | 'detail' | 'edit';

const categoryEmojis = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️',
  dessert: '🍰',
  snack: '🍿',
};

export default function RecipeApp() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const selectedRecipe = selectedRecipeId ? getRecipeById(selectedRecipeId) : null;

  // Load recipes on mount
  useEffect(() => {
    const loadedRecipes = getRecipes();
    setRecipes(loadedRecipes);
    setFilteredRecipes(loadedRecipes);
    setIsLoaded(true);
  }, []);

  // Apply filters whenever search query or category changes
  useEffect(() => {
    let results = recipes;

    if (selectedCategory !== 'all') {
      results = results.filter(recipe => recipe.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const searchLower = searchQuery.toLowerCase();
      results = results.filter(recipe =>
        recipe.title.toLowerCase().includes(searchLower)
      );
    }

    setFilteredRecipes(results);
  }, [searchQuery, selectedCategory, recipes]);

  const refreshRecipes = () => {
    const loadedRecipes = getRecipes();
    setRecipes(loadedRecipes);
  };

  const handleAddRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    addRecipe(recipeData);
    refreshRecipes();
    setCurrentView('list');
  };

  const handleUpdateRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedRecipeId) {
      updateRecipe(selectedRecipeId, recipeData);
      refreshRecipes();
      setCurrentView('detail');
    }
  };

  const handleDeleteRecipe = () => {
    if (selectedRecipeId) {
      deleteRecipe(selectedRecipeId);
      refreshRecipes();
      setCurrentView('list');
      setSelectedRecipeId(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleViewRecipe = (id: string) => {
    setSelectedRecipeId(id);
    setCurrentView('detail');
  };

  if (!isLoaded) {
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

  // Recipe List View
  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50">
        <header className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">🍳 Recipe Collection</h1>
              <button
                onClick={() => setCurrentView('add')}
                className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-orange-50 transition shadow-md"
              >
                + Add Recipe
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <SearchBar
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
          />

          {filteredRecipes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍽️</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                {recipes.length === 0 ? 'No recipes yet!' : 'No recipes found'}
              </h2>
              <p className="text-gray-500 mb-6">
                {recipes.length === 0
                  ? 'Start building your collection by adding your first recipe.'
                  : 'Try adjusting your search or filter.'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory === 'all' ? 'All Recipes' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Recipes`}
                  <span className="ml-3 text-lg font-normal text-gray-500">
                    ({filteredRecipes.length})
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} onView={handleViewRecipe} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    );
  }

  // Add Recipe View
  if (currentView === 'add') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <RecipeForm onSubmit={handleAddRecipe} onCancel={() => setCurrentView('list')} />
        </main>
      </div>
    );
  }

  // Edit Recipe View
  if (currentView === 'edit' && selectedRecipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <RecipeForm
            initialRecipe={selectedRecipe}
            onSubmit={handleUpdateRecipe}
            onCancel={() => setCurrentView('detail')}
          />
        </main>
      </div>
    );
  }

  // Recipe Detail View
  if (currentView === 'detail' && selectedRecipe) {
    const totalTime = selectedRecipe.prepTime + selectedRecipe.cookTime;

    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-4">{selectedRecipe.title}</h1>
                  <div className="flex items-center gap-6 text-orange-50">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⏱️</span>
                      <span>Total: {totalTime} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👨‍🍳</span>
                      <span>Prep: {selectedRecipe.prepTime} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🔥</span>
                      <span>Cook: {selectedRecipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍽️</span>
                      <span>{selectedRecipe.servings} servings</span>
                    </div>
                  </div>
                </div>
                <span className="text-6xl">{categoryEmojis[selectedRecipe.category]}</span>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold uppercase">
                  {selectedRecipe.category}
                </span>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📝</span> Ingredients
                </h2>
                <div className="bg-orange-50 rounded-lg p-6">
                  <ul className="space-y-3">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span className="text-gray-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>👩‍🍳</span> Instructions
                </h2>
                <div className="space-y-4">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 flex-1 pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentView('edit')}
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
                  onClick={() => setCurrentView('list')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </main>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Delete Recipe?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete &quot;{selectedRecipe.title}&quot;? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteRecipe}
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

  return null;
}