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
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <div className="bg-gray-200 border border-gray-600 rounded-md py-1 px-2 mb-4">
              <Link href="#" onClick={() => handleCategoryClick(category.id)}>
                {category.name}
              </Link>
            </div>
            <div className="flex flex-col space-y-4">
              <ul className="text-sm px-2 mb-4">
                {category.children.map((child) => (
                  <li>
                    <Link
                      href="#"
                      onClick={() => handleCategoryClick(child.id)}
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryExplorer;
