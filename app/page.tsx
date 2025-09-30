'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/lib/types';
import { getRecipes, searchRecipes, filterRecipesByCategory } from '@/lib/storage';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);

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

    // Apply category filter
    if (selectedCategory !== 'all') {
      results = filterRecipesByCategory(selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const searchLower = searchQuery.toLowerCase();
      results = results.filter(recipe =>
        recipe.title.toLowerCase().includes(searchLower)
      );
    }

    setFilteredRecipes(results);
  }, [searchQuery, selectedCategory, recipes]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50">
      <Header />

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
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}