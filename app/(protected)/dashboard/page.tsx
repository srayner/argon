"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  FcFactory,
  FcShipped,
  FcPackage,
  FcGallery,
  FcTreeStructure,
} from "react-icons/fc";
import { FaSearch } from "react-icons/fa";
import { Card } from "@/components/dashboard/card";

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
        <h1 className={styles.heading}>Stock Control</h1>

        <div className="grid grid-cols-2 gap-4">
          <Card
            href="/dashboard/categories"
            icon={FcTreeStructure}
            title="Categories"
            text="Products belong to categories."
            count={data && data.categories.count}
            testid="categories-count"
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
