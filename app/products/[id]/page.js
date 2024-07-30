"use client";

import { useEffect, useState } from "react";
import Button from "../../ui/button/button";
import Header from "../../ui/header/header";
import { DetailList, DetailRow } from "../../ui/detail/detail";

export default function ProductDetailPage({ params }) {
  const productId = params.id;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`/api/products/${productId}`);
      const product = await response.json();
      setProduct(product);
    };
    fetchProduct();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  const manufacturer = product.manufacturer;
  const supplier = product.supplier;

  return (
    <>
      <Header>
        <span>{product.name}</span>
        <Button size="small">Edit</Button>
        <Button size="small" color="danger">
          Delete
        </Button>
      </Header>
      <DetailList>
        <DetailRow title="Name" value={product.name} />
        {manufacturer && (
          <DetailRow title="Manufacturer" value={manufacturer.name} />
        )}
        {supplier && <DetailRow title="Supplier" value={supplier.name} />}
      </DetailList>
    </>
  );
}
