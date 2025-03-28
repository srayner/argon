"use client";

import { useEffect, useState } from "react";
import {
  FcFactory,
  FcOrganization,
  FcShipped,
  FcPackage,
  FcGallery,
  FcTreeStructure,
} from "react-icons/fc";
import { FaSearch } from "react-icons/fa";
import { Card } from "@/components/dashboard/Card";

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/dashboard");
      const fetchedData = await response.json();
      setData(fetchedData.data);
    };
    fetchData();
  }, []);

  return (
    <main>
      <div>
        <h1 className="mb-5">Stock Control</h1>

        <div className="grid grid-cols-[repeat(auto-fill,_minmax(400px,_1fr))] gap-4">
          <Card
            href="/dashboard/categories"
            icon={FcTreeStructure}
            title="Categories"
            text="Products belong to categories."
            count={data && data.categories.count}
            testid="categories-count"
          />
          <Card
            href="/dashboard/locations"
            icon={FcOrganization}
            title="Locations"
            text="Products can be stocked in multiple Locations."
            count={data && data.locations.count}
            testid="locations-count"
          />
          <Card
            href="/dashboard/manufacturers"
            icon={FcFactory}
            title="Manufacturers"
            text="Manufacturers make products."
            count={data && data.manufacturers.count}
            testid="manufacturers-count"
          />
          <Card
            href="/dashboard/suppliers"
            icon={FcShipped}
            title="Suppliers"
            text="Suppliers sell products."
            count={data && data.suppliers.count}
            testid="suppliers-count"
          />
          <Card
            href="/dashboard/products"
            icon={FcPackage}
            title="Products"
            text="Track your products and their locations."
            count={data && data.products.count}
            testid="products-count"
          />
          <Card
            href="/dashboard/images"
            icon={FcGallery}
            title="Images"
            text="Images can be added to products."
            count={data && data.images.count}
            testid="images-count"
          />

          <Card
            href="/dashboard/search"
            icon={FaSearch}
            title="Advanced Search"
            text="Search products by custom properties."
          />
        </div>
      </div>
    </main>
  );
}
