"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Form from "@/components/form/Form";
import Header from "@/components/ui/header/Header";
import SubmitContainer from "@/components/form/SubmitContainer";
import Select from "@/components/form/select/Select";
import NumberInput from "@/components/form/input/NumberInput";
import TextInput from "@/components/form/input/TextInput";

interface ProductEditPageProps {
  params: {
    id: string;
  };
}

const ProductEditPage: React.FC<ProductEditPageProps> = ({ params }) => {
  const editProductSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    categoryId: z.string().nullable(),
    manufacturerId: z.number().nullable(),
    manufacturerPartNo: z.string().nullable(),
    supplierId: z.number().nullable(),
    supplierPartNo: z.string().nullable(),
    cost: z.number().nullable(),
    qtyInStock: z
      .number({ message: "Quantity is required, but may be zero." })
      .int(),
    location: z.string().nullable(),
  });

  type EditProductSchema = z.infer<typeof editProductSchema>;

  const productId = params.id;
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [manufacturers, setManufacturers] = useState<
    { id: number; name: string }[]
  >([]);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const router = useRouter();

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm<EditProductSchema>({
    resolver: zodResolver(editProductSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    router.push(`/dashboard/products/${productId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          productResponse,
          categoriesResponse,
          manufacturersResponse,
          suppliersResponse,
        ] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch("/api/categories?sort=name&pageSize=100"),
          fetch("/api/manufacturers?pageSize=50"),
          fetch("/api/suppliers?pageSize=50"),
        ]);

        if (
          !productResponse.ok ||
          !categoriesResponse.ok ||
          !manufacturersResponse.ok ||
          !suppliersResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const product = await productResponse.json();
        const { id, ...rest } = product;
        const { data: categories } = await categoriesResponse.json();
        const { data: manufacturers } = await manufacturersResponse.json();
        const { data: suppliers } = await suppliersResponse.json();

        setCategories(categories);
        setManufacturers(manufacturers);
        setSuppliers(suppliers);

        reset(rest);
      } catch (error) {
        setError("Failed to fetch data from the API.");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Header caption="Edit Product" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label={"Name"}
          register={register}
          fieldName={"name"}
          errors={errors}
        />

        <Select
          label={"Category"}
          register={register}
          fieldName={"categoryId"}
          isValueNumeric={false}
          options={categories}
        />

        <Select
          label={"Manufacturer"}
          register={register}
          fieldName={"manufacturerId"}
          isValueNumeric={true}
          options={manufacturers}
        />

        <TextInput
          label={"Manufacturer Part No"}
          register={register}
          fieldName={"manufacturerPartNo"}
          errors={errors}
        />

        <Select
          label={"Supplier"}
          register={register}
          fieldName={"supplierId"}
          isValueNumeric={true}
          options={suppliers}
        />

        <TextInput
          label={"Supplier Part No"}
          register={register}
          fieldName={"supplierPartNo"}
          errors={errors}
        />

        <NumberInput
          label={"Cost"}
          register={register}
          fieldName={"cost"}
          errors={errors}
          isFloat={true}
        />

        <NumberInput
          label={"Qty In Stock"}
          register={register}
          fieldName={"qtyInStock"}
          errors={errors}
        />

        <TextInput
          label={"Location"}
          register={register}
          fieldName={"location"}
          errors={errors}
        />

        <SubmitContainer>
          <Button color="secondary" href={`/dashboard/products/${productId}`}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Edit
          </Button>
        </SubmitContainer>
      </Form>
    </>
  );
};

export default ProductEditPage;
