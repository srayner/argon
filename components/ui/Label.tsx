import React from "react";

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="text-base text-label font-bold mr-1">
      {children}
    </label>
  );
};

export default Label;
