import React, { ReactNode } from "react";
import Styles from "./form.module.css";

interface FormProps {
  layout?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  [key: string]: any;
}

const Form: React.FC<FormProps> = ({
  layout = "vertical",
  onSubmit,
  children,
  ...rest
}) => {
  const formClassName =
    layout === "horizontal" ? Styles.formHorizontal : Styles.formVertical;

  return (
    <form className={formClassName} onSubmit={onSubmit} {...rest}>
      {children}
    </form>
  );
};

export default Form;
