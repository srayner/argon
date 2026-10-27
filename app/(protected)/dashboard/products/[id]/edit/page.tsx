"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProductSchema, EditProductValues } from "@/schemas";
import Button from "@/app/ui/button/button";
import Form from "@/components/form/Form";
import Header from "@/components/ui/header/Header";
import SubmitContainer from "@/components/form/SubmitContainer";
import Select from "@/components/form/select/Select";
import NumberInput from "@/components/form/input/NumberInput";
import TextInput from "@/components/form/input/TextInput";

interface ProductEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ProductEditPage: React.FC<ProductEditPageProps> = props => {
  const params = use(props.params);
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
  } = useForm<EditProductValues>({
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
          fetch("/api/categories?sort=name&pageSize=150"),
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
