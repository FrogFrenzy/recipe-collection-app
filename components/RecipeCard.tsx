import Link from 'next/link';
import { Recipe } from '@/lib/types';

interface RecipeCardProps {
  recipe: Recipe;
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

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 h-full cursor-pointer">
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
    </Link>
  );
}