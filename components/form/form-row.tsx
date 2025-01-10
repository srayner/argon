import React, { ReactNode } from "react";
import Styles from "./form.module.css";

interface FormRowProps {
  children: ReactNode;
}

const FormRow: React.FC<FormRowProps> = ({ children }) => {
  return <div className={Styles.formRow}>{children}</div>;
};

export default FormRow;
