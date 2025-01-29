"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/app/ui/header/header";
import SubmitContainer from "@/components/form/SubmitContainer";
import styles from "./page.module.css";

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
          fetch(`/api/locations?pageSize=50&exclude=${locationId}`),
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

  return (
    <>
      <Header>Edit Location</Header>
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
              None - root location
            </option>
            {locations.map((c) => {
              return (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              );
            })}
          </select>
          {errors.parentId && (
            <p
              className={styles.errorMessage}
            >{`${errors.parentId.message}`}</p>
          )}
        </div>

        <SubmitContainer>
          <Button color="secondary" href={`/dashboard/locations/${locationId}`}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Edit
          </Button>
        </SubmitContainer>
      </form>
    </>
  );
};

export default LocationEditPage;
