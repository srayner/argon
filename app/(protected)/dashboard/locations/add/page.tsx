"use client";

import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/app/ui/header/header";
import SubmitContainer from "@/app/ui/submit-container/submit-container";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

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

  return (
    <>
      <Header>Add Location</Header>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formItem}>
          <label>Code</label>
          <div>
            <input {...register("code")} type="text" autoComplete="off" />
            {errors.code && (
              <p className={styles.errorMessage}>{`${errors.code.message}`}</p>
            )}
          </div>
        </div>

        <div className={styles.formItem}>
          <label>Name</label>
          <div>
            <input {...register("name")} type="text" autoComplete="off" />
            {errors.name && (
              <p className={styles.errorMessage}>{`${errors.name.message}`}</p>
            )}
          </div>
        </div>

        <div className={styles.formItem}>
          <label>Parent Location</label>
          <select
            {...register("parentId", {
              setValueAs: (value) => (!value ? null : value),
            })}
          >
            <option key="!" value="">
              None - root parent
            </option>
            {locations.map((c) => {
              return (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              );
            })}
          </select>
        </div>

        <SubmitContainer>
          <Button color="secondary" href="/dashboard/locations">
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Add
          </Button>
        </SubmitContainer>
      </form>
    </>
  );
};

export default LocationAddPage;
