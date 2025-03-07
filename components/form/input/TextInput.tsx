import React from "react";
import Error from "@/components/form/Error";

interface TextInputProps {
  label?: string;
  register: any;
  fieldName: string;
  errors: any;
  width?: number;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  register,
  fieldName,
  errors,
  width = 300,
}) => {
  return (
    <div className="flex">
      {label && (
        <label className="w-[200px] p-1.5 text-[var(--text-color)] text-base font-bold">
          {label}
        </label>
      )}
      <div>
        <input
          {...register(fieldName)}
          type="text"
          autoComplete="off"
          className="border border-[var(--seperator-color)] rounded px-2 py-1.5 text-[var(--text-color)] text-base shadow-md"
          style={{ width: `${width}px` }}
        ></input>
        {errors && errors[fieldName] && (
          <Error message={`${errors[fieldName].message}`} />
        )}
      </div>
    </div>
  );
};

export default TextInput;
