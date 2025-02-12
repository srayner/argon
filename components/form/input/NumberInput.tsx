import React from "react";
import { RegisterOptions } from "react-hook-form";
import Error from "@/components/form/Error";

interface TextInputProps {
  label?: string;
  register: any;
  fieldName: string;
  errors: any;
  isFloat?: boolean;
}

const NumberInput: React.FC<TextInputProps> = ({
  label,
  register,
  fieldName,
  errors,
  isFloat = false,
}) => {
  let options: RegisterOptions = {};
  if (isFloat) {
    options.setValueAs = (v) => (v === "" || v === null ? null : parseFloat(v));
  } else {
    options.valueAsNumber = true;
  }

  return (
    <div className="flex">
      {label && (
        <label className="w-[200px] p-1.5 text-[var(--text-color)] text-sm font-bold">
          {label}
        </label>
      )}
      <div>
        <input
          {...register(fieldName, options)}
          type="text"
          autoComplete="off"
          className="w-[300px] border border-[var(--seperator-color)] rounded px-2 py-1.5 text-[var(--text-color)] text-base shadow-md"
        ></input>
        {errors && errors[fieldName] && (
          <Error message={errors[fieldName].message} />
        )}
      </div>
    </div>
  );
};

export default NumberInput;
