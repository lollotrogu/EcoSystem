import React from 'react';
import { CATEGORIES } from '../constants/categories';
import CategoryCard from './CategoryCard';
export default function CategoryGrid({ selectedCategory, onSelectCategory, countsByCategory }) {
  return <section className="page-section category-section" aria-labelledby="areas-title"><div className="section-heading"><div><h2 id="areas-title">Scegli un’area</h2></div><button className="text-button" onClick={() => onSelectCategory(null)} aria-pressed={!selectedCategory}>Tutte le aree</button></div><div className="category-grid">{CATEGORIES.map((category) => <CategoryCard key={category.id} category={category} isSelected={selectedCategory === category.id} onClick={() => onSelectCategory(selectedCategory === category.id ? null : category.id)} itemCount={countsByCategory[category.id] || 0} />)}</div></section>;
}
