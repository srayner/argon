import React from "react";

interface InputProps {
  id: string;
  type: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ id, type, onChange }) => {
  return (
    <input
      id={id}
      type={type}
      onChange={onChange}
      className="h-8 border border-inputBorder rounded-md px-2.5 py-1 text-inputText text-base"
      autoComplete="off"
    />
  );
};

export default Input;
