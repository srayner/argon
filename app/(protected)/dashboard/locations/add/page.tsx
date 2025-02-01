"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/app/ui/header/header";
import SubmitContainer from "@/components/form/SubmitContainer";
import Form from "@/components/form/form";
import TextInput from "@/components/form/input/TextInput";
import Select from "@/components/form/select/Select";

const LocationAddPage: React.FC = () => {
  const addLocationSchema = z.object({
    code: z.string().nullable().optional(),
    name: z.string().min(1, { message: "Name is required." }),
    parentId: z.string().nullable(),
  });

  type AddLocationSchema = z.infer<typeof addLocationSchema>;

  const router = useRouter();
  const [locations, setLocations] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsResponse] = await Promise.all([
          fetch("/api/locations?pageSize=50"),
        ]);

        if (!locationsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const { data: locations } = await locationsResponse.json();

        setLocations(locations);
      } catch (error) {
        setError("Failed to fetch data from the API.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
  } = useForm<AddLocationSchema>({
    resolver: zodResolver(addLocationSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    const transformedData = {
      ...data,
      code: data.code === "" ? null : data.code,
    };
    const response = await fetch("/api/locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    });
    router.push("/dashboard/locations");
  };

  const parentOptions = [
    { id: "", name: "None - root location" },
    ...locations.map(({ id, name }) => ({ id, name })),
  ];

  return (
    <>
      <Header>Add Location</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          fieldName="code"
          label="Code"
          register={register}
          errors={errors}
        />

        <TextInput
          fieldName="name"
          label="Name"
          register={register}
          errors={errors}
        />

        <Select
          label="Parent Location"
          register={register}
          fieldName="parentId"
          isValueNumeric={false}
          isOptional={false}
          options={parentOptions}
        />

        <SubmitContainer>
          <Button color="secondary" href="/dashboard/locations">
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Add
          </Button>
        </SubmitContainer>
      </Form>
    </>
  );
};

export default LocationAddPage;
