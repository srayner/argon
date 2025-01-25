import { number } from "zod";

export type PropertyType = "STRING" | "NUMERIC" | "METRIC" | "IMPERIAL";
export type UnitPosition = "PREFIX" | "SUFFIX";

export interface Category {
  id: string;
  code: string;
  name: string;
  parent: Category | null;
  children: Category[];
  properties: Property[];
  image?: Image;
}

export interface Image {
  id: number;
  href: string;
  name: string;
}

export interface Manufacturer {
  id: number;
  name: string;
  image?: Image;
}

export interface Product {
  id: number;
  name: string;
  category?: Category;
  categoryId?: string;
  manufacturer: Manufacturer | null;
  manufacturerId: number | null;
  manufacturerPartNo: string | null;
  supplier: Supplier | null;
  supplierId: number | null;
  supplierPartNo: string | null;
  cost: number | null;
  qtyInStock: number;
  location: string | null;
  image?: Image;
  imageId?: number;
  propertyValues: PropertyValue[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  units: string | null;
  unitPosition: UnitPosition;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyValue {
  id: string;
  valueString: string;
  valueNumeric: number;
  productId: number;
  propertyId: string;
  property: Property;
}

export interface AggregatedPropertyValue {
  value: string | number;
  count: number;
}

export interface Supplier {
  id: number;
  name: string;
  image?: Image;
}
