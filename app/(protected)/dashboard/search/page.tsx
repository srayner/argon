"use client";

import { NextPage } from "next";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PropertyValuesFilter from "@/components/property-values/PropertyValuesFilter";
import { PropertyValueFilter } from "@/types/filter";
import Header from "@/components/ui/header/Header";
import CategoryExplorer from "@/components/categories/CategoryExplorer";
import SimpleDataGrid from "@/components/ui/datagrid/SimpleDataGrid";
import { ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { Product, Category, Property } from "@/types/entities";

const SearchPage: NextPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<Category | null>(null);
  const [filters, setFilters] = useState<PropertyValueFilter[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchRootCategories = useCallback(async () => {
    const response = await fetch("/api/categories?parentId=null");

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const { data } = await response.json();
    setCategories(data);
  }, []);

  const loadCategory = useCallback(async (categoryId: string) => {
    try {
      const [catResponse, propsResponse] = await Promise.all([
        fetch(`/api/categories/${categoryId}?depth=2`),
        fetch(`/api/properties?categoryId=${categoryId}`),
      ]);

      const cat = await catResponse.json();
      const { data: props } = await propsResponse.json();

      setCategory(cat);
      setCategories(cat.children);
      setProperties(props);
      setFilters([]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    if (categoryId) {
      loadCategory(categoryId);
    } else {
      fetchRootCategories();
      setCategory(null);
      setProperties([]);
      setProducts([]);
      setFilters([]);
    }
  }, [searchParams, loadCategory, fetchRootCategories]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sort: "name",
          customProperties: filters,
          categoryId: category?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const { data } = await response.json();
      setProducts(data);
    };

    if (category !== null) {
      fetchProducts();
    }
  }, [category, filters]);

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/dashboard/search?categoryId=${categoryId}`);
  };

  const columnDefs = [
    {
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
      field: "qtyInStock",
      cellStyle: { textAlign: "right" },
    },
  ];

  const title = category ? category.name : "All Products";

  return (
    <>
      <Header caption={title} />
      {categories.length !== 0 && (
        <div className="w-full">
          <CategoryExplorer
            categories={categories}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      )}

      {properties.length !== 0 && (
        <div className="w-full mb-4">
          <h3>Filters</h3>
          <PropertyValuesFilter
            properties={properties}
            onRefresh={setFilters}
          />
        </div>
      )}

      {products.length !== 0 && (
        <div>
          <h3>Search Results</h3>
          <SimpleDataGrid
            rowData={products}
            rowHeight={100}
            columnDefs={columnDefs}
          />
        </div>
      )}
    </>
  );
};

export default SearchPage;
