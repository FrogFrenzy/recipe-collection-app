# 🍳 Recipe Collection App

A modern, beginner-friendly recipe collection app built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✨ Add, edit, and delete recipes
- 🔍 Search recipes by title
- 🏷️ Filter by category (Breakfast, Lunch, Dinner, Dessert, Snack)
- 📱 Responsive design (mobile-friendly)
- 💾 Data persists in browser localStorage
- 🎨 Beautiful gradient UI with Tailwind CSS

## Getting Started

### Installation

1. Navigate to the project directory:
```bash
cd recipe-collection-app
```

2. Install dependencies (if not already done):
```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Deploy the app:
```bash
vercel
```

3. Follow the prompts to complete deployment.

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy" (Vercel auto-detects Next.js settings)

Your app will be live in minutes! 🚀

## Project Structure

```
recipe-collection-app/
├── app/
│   ├── page.tsx              # Home page (recipe list)
│   ├── add/page.tsx          # Add new recipe
│   ├── recipe/[id]/page.tsx  # Recipe detail view
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── Header.tsx            # Navigation header
│   ├── RecipeCard.tsx        # Recipe preview card
│   ├── SearchBar.tsx         # Search and filter
│   └── RecipeForm.tsx        # Add/edit recipe form
├── lib/
│   ├── types.ts              # TypeScript types
│   └── storage.ts            # localStorage utilities
└── package.json
```

## Technologies Used

- **Next.js 15** - React framework with app router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **localStorage** - Client-side data persistence

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## Future Enhancements

Ideas to expand your app:
- Add image uploads for recipes
- Star/favorite recipes
- Export recipes as PDF
- Share recipes via URL
- Add a backend database (Supabase, Firebase)
- User authentication
- Recipe ratings and comments
- Meal planning calendar

Happy cooking! 👨‍🍳👩‍🍳