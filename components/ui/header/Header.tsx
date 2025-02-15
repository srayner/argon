import React, { ReactNode } from "react";

interface HeaderProps {
  caption: string;
  children?: ReactNode;
}
const Header: React.FC<HeaderProps> = ({ caption, children }) => {
  return (
    <div className="flex gap-2 items-center min-h-[32px] [&>*:first-child]:flex-grow mb-2">
      <h1>{caption}</h1>
      {children}
    </div>
  );
};

export default Header;
