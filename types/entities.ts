export interface Property {
  id: string;
  name: string;
  type: string;
  units: string | null;
  unitPosition: string;
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
