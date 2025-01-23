"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PropertyValuesFilter, {
  Filter,
} from "@/components/property-values/PropertyValuesFilter";
import CategoryExplorer from "@/components/categories/CategoryExplorer";
import SimpleDataGrid from "@/components/ui/datagrid/SimpleDataGrid";
import { ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { Product } from "@/types/entities";

const SearchPage: React.FC = () => {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [products, setProducts] = useState<Product[]>([]);

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

  const fetchProducts = async (filters: Filter[]) => {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sort: "name",
        customProperties: filters,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const { data } = await response.json();
    setProducts(data);
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

  const handleCategorySelect = (categoryId: string) => {
    console.log(`Category selected: ${categoryId}`);
    setCategoryId(categoryId);
  };

  const columnDefs = [
    {
      headerName: "Image",
      field: "image",
      width: 150,
      maxWidth: 150,
      cellRenderer: (params: ICellRendererParams) => {
        return params.data && params.data.image ? (
          <img
            src={params.data.image.href}
            alt={params.data.image.name}
            className="w-full h-full object-contain"
          />
        ) : (
          ""
        );
      },
    },
    {
      headerName: "Manufacturer",
      field: "manufacturer.name",
    },
    {
      headerName: "Product",
      field: "name",
      cellRenderer: (params: ICellRendererParams) => {
        return params.data ? (
          <Link href={`/dashboard/products/${params.data.id}`}>
            {params.value}
          </Link>
        ) : (
          ""
        );
      },
    },
    {
      headerName: "Category",
      field: "category.name",
    },
    {
      headerName: "Supplier",
      field: "supplier.name",
    },
    {
      field: "cost",
      valueFormatter: (params: ValueFormatterParams) => {
        if (
          params === undefined ||
          params.value === undefined ||
          typeof params.value !== "number"
        ) {
          return "";
        }
        return "£" + params.value.toFixed(2);
      },
      cellStyle: { textAlign: "right" },
      sortable: true,
    },
    {
      header: "Qty in stock",
      field: "qtyInStock",
      cellStyle: { textAlign: "right" },
    },
  ];

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
            onRefresh={fetchProducts}
          />
        </div>
      )}

      {products.length !== 0 && (
        <SimpleDataGrid
          rowData={products}
          rowHeight={100}
          columnDefs={columnDefs}
        />
      )}
    </>
  );
};

export default SearchPage;
