import React, { useEffect, useRef, useState, useCallback } from "react";
import Error from "@/components/form/Error";
import CustomSelect, { option } from "./CustomSelect";

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
  const [options, setOptions] = useState<option[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
      return;
    }

    isFetching.current = true;

    fetchData().finally(() => {
      isFetching.current = false; // Reset after fetch completes
    });
  }, [page]);

  const handleScroll = () => {
    if (loading || !hasMore) {
      return;
    }
    setPage((prev) => prev + 1);
  };

  // Some hardcoded options for now;
  const mockOptions = ["Apple", "Bannana", "Carot", "Fish", "Oraage", "Peach"];

  return (
    <div className="flex">
      {label && (
        <label className="w-[200px] p-1.5 text-[var(--text-color)] text-base font-bold">
          {label}
        </label>
      )}
      <div>
        <CustomSelect
          options={options}
          width="w-[300px]"
          onScrollToBottom={handleScroll}
        />
        {errors && errors[fieldName] && (
          <Error message={errors[fieldName].message} />
        )}
      </div>
    </div>
  );
};

export default FetchSelect;
