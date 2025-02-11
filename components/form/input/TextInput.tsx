import React from "react";

interface TextInputProps {
  label?: string;
  register: any;
  fieldName: string;
  errors: any;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  register,
  fieldName,
  errors,
}) => {
  return (
    <div className="flex">
      {label && (
        <label className="w-[200px] p-1.5 text-[var(--text-color)] text-sm font-bold">
          {label}
        </label>
      )}
      <div>
        <input
          {...register(fieldName)}
          type="text"
          autoComplete="off"
          className="w-[300px] h-[32px] border border-[var(--seperator-color)] rounded px-2.5 py-1 text-[var(--text-color)] text-sm"
        ></input>
        {errors && errors[fieldName] && (
          <p className="text-sm text-red-600">{`${errors[fieldName].message}`}</p>
        )}
      </div>
    </div>
  );
};

export default TextInput;
