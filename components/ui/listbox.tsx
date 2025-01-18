"use client";

import React, { useState } from "react";
interface ListBoxProps {
  label: string;
  options: Array<{ name: string; value: string | number }>;
  width?: string;
}

const ListBox: React.FC<ListBoxProps> = ({ label, options, width }) => {
  const [selectedItems, setSelectedItems] = useState<Array<string | number>>(
    []
  );

  const toggleSelection = (value: string | number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
    );
  };
  const widthClass = width ? width : "w-full";

  return (
    <div className={`mb-4 ${widthClass}`}>
      <h3 className="font-bold text-sm mb-2 px-2">{label}</h3>
      <div className="bg-white rounded p-2 w-full max-h-64 overflow-y-auto">
        <ul>
          {options.map((option) => (
            <li
              key={option.value}
              className={`p-1 text-sm cursor-pointer hover:text-blue-500 ${
                selectedItems.includes(option.value)
                  ? "bg-gray-300 text-black hover:text-blue-500k"
                  : ""
              }`}
              onClick={() => toggleSelection(option.value)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListBox;
