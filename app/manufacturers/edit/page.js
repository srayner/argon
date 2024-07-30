"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import Header from "@/app/ui/header/header";
import Button from "@/app/ui/button/button";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

const ManufacturerAddPage: React.FC = () => {
  const ediManufacturerSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
  });

  type AddManufacturerSchema = z.infer<typeof editManufacturerSchema>;

  const router = useRouter();

  return (
    <>
      <Header>Add Manufacturer</Header>
      <div className={styles.submitContainer}>
        <Button color="secondary" href="/manufacturers">
          Cancel
        </Button>
        <Button color="primary" type="submit">
          Edit
        </Button>
      </div>
    </>
  );
};
