"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastContext";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/components/ui/header/Header";
import SubmitContainer from "@/components/form/SubmitContainer";
import Form from "@/components/form/Form";
import TextInput from "@/components/form/input/TextInput";
import Select from "@/components/form/select/Select";

const LocationAddPage: NextPage = () => {
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
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsResponse] = await Promise.all([
          fetch("/api/locations?pageSize=200"),
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

    if (response.ok) {
      const newLocation = await response.json();
      router.push(`/dashboard/locations/${newLocation.id}`);
    } else {
      const responseData = await response.json();
      showToast(responseData.error || "An error occured.");
      router.push("/dashboard/locations");
    }
  };

  const parentOptions = [
    { id: "", name: "None - root location" },
    ...locations.map(({ id, name }) => ({ id, name })),
  ];

  return (
    <>
      <Header caption="Add Location" />
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
