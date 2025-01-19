"use client";

import React, { useEffect, useState } from "react";
import PropertyValuesFilter from "@/components/property-values/PropertyValuesFilter";
import CategoryExplorer from "@/components/categories/CategoryExplorer";

const SearchPage: React.FC = () => {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  const fetchCategories = async () => {
    const queryParam =
      categoryId === null ? "parentId=null" : `parentId=${categoryId}`;
    const response = await fetch(`/api/categories?${queryParam}`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const { data } = await response.json();
    setCategories(data);
  };

  const fetchProperties = async () => {
    const response = await fetch(`/api/properties?categoryId=${categoryId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }

    const { data } = await response.json();
    setProperties(data);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          categoryId !== null ? fetchProperties() : Promise.resolve([]),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [categoryId]);

  const handleRefresh = (newFilterState: any) => {
    console.log("Filter state submitted or reset:", newFilterState);
  };

  const handleCategorySelect = (categoryId: string) => {
    console.log(`Category selected: ${categoryId}`);
    setCategoryId(categoryId);
  };

  return (
    <>
      {categories.length !== 0 && (
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Product Cateogires</h2>
          <CategoryExplorer
            categories={categories}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      )}

      {properties.length !== 0 && (
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Advanced Search</h2>
          <PropertyValuesFilter
            properties={properties}
            onRefresh={handleRefresh}
          />
        </div>
      )}
    </>
  );
};

export default SearchPage;
