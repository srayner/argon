import React, { useEffect, useState, useCallback } from "react";
import { Controller } from "react-hook-form";
import Error from "@/components/form/Error";
import CustomSelect, { option } from "./CustomSelect";
import { mergeArraysNoDuplicates } from "@/lib/mergeArrays";

type FetchSelectProps = {
  label: string;
  control: any;
  fieldName: string;
  url: string;
  valueField?: string;
  nameField?: string;
  defaultOption?: option;
  isValueNumeric?: boolean;
  pageSize?: number;
};

const FetchSelect: React.FC<FetchSelectProps> = ({
  label,
  control,
  fieldName,
  url,
  valueField = "id",
  nameField = "name",
  defaultOption = null,
  pageSize = 10,
}) => {
  const initialOptions = defaultOption ? [defaultOption] : [];

  const [options, setOptions] = useState<option[]>(initialOptions);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const urlObj = new URL(url, window.location.origin);

      urlObj.searchParams.set("page", page.toString());
      urlObj.searchParams.set("pageSize", pageSize.toString());
      urlObj.searchParams.set("search", search);
      urlObj.searchParams.set("sort", "name");

      console.log("URL: " + urlObj.toString());

      const pageRequest = await fetch(urlObj.toString()).then((res) =>
        res.json()
      );

      const selectedValue = control._defaultValues?.[fieldName];

      const selectedItemRequest =
        selectedValue && !options.some((opt) => opt.value === selectedValue)
          ? fetch(`${url}/${selectedValue}`).then((res) => res.json())
          : Promise.resolve(null);

      const [pageResponse, selectedItemResponse] = await Promise.all([
        pageRequest,
        selectedItemRequest,
      ]);

      const pageData = pageResponse.data.map((item: any) => ({
        value: item[valueField],
        name: item[nameField],
      }));

      const selectedItem = selectedItemResponse
        ? {
            value: selectedItemResponse[valueField],
            name: selectedItemResponse[nameField],
          }
        : null;

      setOptions((prevOptions) => {
        return mergeArraysNoDuplicates(
          prevOptions,
          [...pageData, ...(selectedItem ? [selectedItem] : [])],
          "value",
          "name"
        );
      });

      setHasMore(pageResponse.meta.totalPages > pageResponse.meta.currentPage);
    } catch (err) {
      console.error(err);
      setError("Failed to load options.");
    } finally {
      setLoading(false);
    }
  }, [url, page, pageSize, search, loading, hasMore, valueField, nameField]);

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const handleScroll = () => {
    if (loading || !hasMore) {
      return;
    }
    setPage((prev) => prev + 1);
  };

  const handleSearch = (searchTerm: string) => {
    setOptions(initialOptions);
    setPage(1);
    setSearch(searchTerm);
  };

  return (
    <div className="flex">
      {label && (
        <label className="w-[200px] p-1.5 text-[var(--text-color)] text-base font-bold">
          {label}
        </label>
      )}
      <div>
        <Controller
          name={fieldName}
          control={control}
          render={({ field, fieldState }) => (
            <>
              <CustomSelect
                {...field}
                options={options}
                width="w-[300px]"
                e2e={fieldName + "-select"}
                onScrollToBottom={handleScroll}
                onSearchChanged={handleSearch}
              />
              {fieldState.error && fieldState.error.message && (
                <Error message={fieldState.error.message} />
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default FetchSelect;
