import React from 'react';
import { Wrench, Code2, Bot, Glasses, Box, Globe, Sparkles } from 'lucide-react';

const ICON_MAP = {
  Wrench,
  Code2,
  Bot,
  Glasses,
  Box,
  Globe,
};

export default function CategoryCard({ category, isSelected, onClick, itemCount }) {
  const IconComponent = ICON_MAP[category.icon] || Sparkles;

  return (
    <button
      onClick={onClick}
      className={`group relative text-left w-full p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 transform active:scale-95 shadow-sm overflow-hidden flex flex-col justify-between ${
        isSelected
          ? `${category.cardBorderClass} shadow-lg ring-4 ring-slate-100 bg-white scale-[1.02]`
          : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md hover:-translate-y-1'
      }`}
    >
      {/* Barra superiore colorata */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300"
        style={{ backgroundColor: category.colorHex }}
      />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className="p-2.5 rounded-xl transition-colors duration-200"
          style={{
            backgroundColor: `${category.colorHex}15`,
            color: category.colorHex,
          }}
        >
          <IconComponent className="w-6 h-6" />
        </div>

        {itemCount !== undefined && (
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{
              backgroundColor: `${category.colorHex}10`,
              borderColor: `${category.colorHex}30`,
              color: category.id === 'yellow' ? '#854d0e' : category.colorHex,
            }}
          >
            {itemCount} {itemCount === 1 ? 'scheda' : 'schede'}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
          {category.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          {isSelected ? 'Selezionato (clicca per mostrare/nascondere)' : 'Clicca per esplorare'}
        </p>
      </div>
    </button>
  );
}

