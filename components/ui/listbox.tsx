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

  return (
    <div className={`mb-4 ${widthClass}`}>
      <h3 className="font-bold text-sm mb-2 px-2">{label}</h3>
      <div className="bg-white rounded p-2 w-full h-[176px] overflow-y-auto">
        <ul>
          {options.map((option) => (
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
    </div>
  );
};

export default ListBox;
