import React from "react";
import Label from "./Label";
import Input from "./Input";

interface SearchInputProps {
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ handleSearchChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="search">Search</Label>
      <Input id="search" type="text" onChange={handleSearchChange} />
    </div>
  );
};

export default SearchInput;
