import React, { ReactNode } from "react";

interface SubmitContainerProps {
  children: ReactNode;
}

const SubmitContainer: React.FC<SubmitContainerProps> = ({ children }) => {
  return <div className="flex justify-end gap-2 w-full">{children}</div>;
};

export default SubmitContainer;
