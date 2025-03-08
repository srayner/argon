import React, { ReactNode } from "react";

interface FormRowProps {
  children: ReactNode;
}

const FormRow: React.FC<FormRowProps> = ({ children }) => {
  return <div className="flex gap-2 items-center">{children}</div>;
};

export default FormRow;
