import React from 'react';
import { CATEGORIES } from '../constants/categories';
import CategoryCard from './CategoryCard';

export default function CategoryGrid({ selectedCategory, onSelectCategory, countsByCategory }) {
  return (
    <section className="mb-10 px-4 sm:px-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">
          Macro Aree STEM
        </h3>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 underline transition-colors"
          >
            Mostra tutte le attività
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() => onSelectCategory(selectedCategory === category.id ? null : category.id)}
            itemCount={countsByCategory[category.id] || 0}
          />
        ))}
      </div>
    </section>
  );
}

