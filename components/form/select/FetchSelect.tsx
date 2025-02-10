import React, { useEffect, useRef, useState, useCallback } from "react";
import Error from "@/components/form/Error";

type option = {
  value: string | number;
  name: string;
};

type FetchSelectProps = {
  label: string;
  register: any;
  fieldName: string;
  errors: any;
  url: string;
  valueField?: string;
  nameField?: string;
  isValueNumeric?: boolean;
  pageSize?: number;
};

const FetchSelect: React.FC<FetchSelectProps> = ({
  label,
  register,
  fieldName,
  errors,
  url,
  valueField = "id",
  nameField = "name",
  isValueNumeric = false,
  pageSize = 10,
}) => {
  console.log("Rendering...");

  const placeholderOption = {
    value: "",
    name: "Please select",
  };

  const [options, setOptions] = useState<option[]>([placeholderOption]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    console.log("Fetching...");
    console.log(loading);
    if (loading) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${url}?page=${page}&pageSize=${pageSize}`);
      const { data, meta } = await response.json();
      const newOptions = data.map((item: any) => ({
        value: item[valueField],
        name: item[nameField],
      }));

      setOptions((prevOptions) => [...prevOptions, ...newOptions]);
      setHasMore(meta.totalPages > meta.currentPage);
    } catch (err) {
      setError("Failed to load options.");
    } finally {
      setLoading(false);
    }
  }, [
    url,
    page,
    pageSize,
    loading,
    hasMore,
    valueField,
    nameField,
    options.length,
  ]);

  const isFetching = useRef(false);

  useEffect(() => {
    if (isFetching.current) {
      console.log("Skipping fetch: Already fetching...");
      return;
    }

    isFetching.current = true;

    fetchData().finally(() => {
      isFetching.current = false; // Reset after fetch completes
    });
  }, [page]);

  // const handleScroll = (e: React.UIEvent<HTMLSelectElement, UIEvent>) => {
  //   const bottom =
  //     e.currentTarget.scrollHeight ===
  //     e.currentTarget.scrollTop + e.currentTarget.clientHeight;
  //   if (bottom) {
  //     console.log("setting page");
  //     //setPage((prevPage) => prevPage + 1);
  //   }
  // };

  return (
    <div className="flex">
      {label && (
        <label className="w-[200px] p-1.5 text-[var(--text-color)] text-base font-bold">
          {label}
        </label>
      )}
      <div>
        <select
          size={5}
          disabled={loading}
          className="w-[300px] h-[32px] border border-[var(--seperator-color)] rounded px-2.5 py-1 text-[var(--text-color)] text-base"
          {...register(fieldName, {
            setValueAs: (value: any) => {
              if (!value) return null;
              return isValueNumeric ? Number(value) : value;
            },
          })}
        >
          {options.map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            );
          })}
        </select>
        {errors && errors[fieldName] && (
          <Error message={errors[fieldName].message} />
        )}
      </div>
    </div>
  );
};

export default FetchSelect;
