import React, { ReactNode } from "react";

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
    layout === "horizontal"
      ? "flex flex-row items-start gap-2.5"
      : "w-[500px] flex flex-col gap-2.5";

  return (
    <form className={formClassName} onSubmit={onSubmit} {...rest}>
      {children}
    </form>
  );
};

export default Form;
