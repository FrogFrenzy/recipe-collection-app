'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import RecipeForm from '@/components/RecipeForm';
import { addRecipe } from '@/lib/storage';
import { Recipe } from '@/lib/types';

export default function AddRecipePage() {
  const router = useRouter();

  const handleSubmit = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    addRecipe(recipeData);
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RecipeForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </main>
    </div>
  );
}