"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/components/ui/header/Header";
import SubmitContainer from "@/components/form/SubmitContainer";
import Form from "@/components/form/Form";
import TextInput from "@/components/form/input/TextInput";
import Select from "@/components/form/select/Select";

interface LocationEditPageProps {
  params: {
    id: string;
  };
}

const LocationEditPage: React.FC<LocationEditPageProps> = ({ params }) => {
  const editLocationSchema = z.object({
    code: z.string(),
    name: z.string().min(1, { message: "Name is required." }),
    parentId: z.string().nullable(),
  });

  type EditLocationSchema = z.infer<typeof editLocationSchema>;

  const locationId = params.id;
  const [locations, setLocations] = useState<{ id: string; name: string }[]>(
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
  } = useForm<EditLocationSchema>({
    resolver: zodResolver(editLocationSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    const transformedData = {
      ...data,
      code: data.code === "" ? null : data.code,
    };
    const response = await fetch(`/api/locations/${locationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    });
    router.push(`/dashboard/locations/${locationId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationResponse, locationsResponse] = await Promise.all([
          fetch(`/api/locations/${locationId}`),
          fetch(`/api/locations?pageSize=150&exclude=${locationId}`),
        ]);

        if (!locationResponse || !locationsResponse) {
          throw new Error("Failed to fetch data");
        }

        const location = await locationResponse.json();
        const { id, ...rest } = location;
        const { data: locations } = await locationsResponse.json();

        setLocations(locations);
        reset(rest);
      } catch (error) {
        setError("Failed to fetch data from API.");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  const parentOptions = [
    { id: "", name: "None - root location" },
    ...locations.map(({ id, name }) => ({ id, name })),
  ];

  return (
    <>
      <Header caption="Edit Location" />
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
          <Button color="secondary" href={`/dashboard/locations/${locationId}`}>
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

export default LocationEditPage;
