"use client";

import React from "react";
import Link from "next/link";
import { Category } from "@/types/entities";

interface CategoryExplorerProps {
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
}

const CategoryExplorer: React.FC<CategoryExplorerProps> = ({
  categories,
  onCategorySelect,
}) => {
  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId); // Notify parent about the selected category
  };

  return (
    <div>
      <ul className="grid grid-cols-2 gap-6">
        {categories.map((category) => (
          <li key={category.id} className="bg-white shadow-lg rounded-md">
            <div className="bg-gradient-to-br from-slate-700 to-slate-600 text-white rounded-t-md py-4 px-3">
              <Link
                href="#"
                onClick={() => handleCategoryClick(category.id)}
                className="text-white text-xl hover:underline hover:text-white"
              >
                {category.name}
              </Link>
            </div>

            {category.children && category.children.length > 0 ? (
              <ul className="grid grid-cols-3 text-sm px-4 py-4">
                {category.children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href="#"
                      onClick={() => handleCategoryClick(child.id)}
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-slate-400 p-4">No subcategories</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryExplorer;
