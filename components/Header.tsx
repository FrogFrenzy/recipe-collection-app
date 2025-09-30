import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:opacity-90 transition">
            🍳 Recipe Collection
          </Link>
          <nav>
            <Link
              href="/add"
              className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-orange-50 transition shadow-md"
            >
              + Add Recipe
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}