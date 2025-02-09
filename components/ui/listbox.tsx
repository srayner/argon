"use client";

import React from "react";

export interface ListBoxOption {
  name: string;
  value: string | number;
  selected: boolean;
}

interface ListBoxProps {
  label: string;
  options: ListBoxOption[];
  width?: string;
  onChange: (label: string, updatedOption: ListBoxOption) => void;
}

const ListBox: React.FC<ListBoxProps> = ({
  label,
  options = [],
  width,
  onChange,
}) => {
  const toggleSelection = (option: ListBoxOption) => {
    const updatedOption = { ...option, selected: !option.selected };
    onChange(label, updatedOption);
  };

  const widthClass = width ? width : "w-full";

  function sort(array: ListBoxOption[]): ListBoxOption[] {
    array.sort((a, b) => {
      if (typeof a.value === "number" && typeof b.value === "number") {
        return a.value - b.value;
      }

      if (typeof a.value === "string" && typeof b.value === "string") {
        return a.value.localeCompare(b.value);
      }

      return a.name.localeCompare(b.name);
    });

    return array;
  }

  const sortedOptions = sort(options);

  return (
    <>
      <h3 className="font-bold text-sm mt-auto mb-2 px-2 row-start-1">
        {label}
      </h3>
      <div className="bg-white rounded p-2 w-full h-[176px] overflow-y-auto row-start-2">
        <ul>
          {sortedOptions.map((option) => (
            <li
              key={option.value}
              className={`p-1 text-sm leading-none cursor-pointer hover:text-blue-500 ${
                option.selected
                  ? "bg-gray-300 text-black hover:text-blue-500"
                  : ""
              }`}
              onClick={() => toggleSelection(option)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ListBox;
