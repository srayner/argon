import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export type option = {
  value: string | number;
  name: string;
};

interface CustomSelectProps {
  value: string | number;
  options: option[];
  width?: string;
  onChange?: (value: string | number) => void;
  onScrollToBottom?: () => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  width = "",
  onChange,
  onScrollToBottom,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<option | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          setIsOpen(true);
        }
      } else {
        if (event.key === "Escape") {
          setIsOpen(false);
        }

        if (event.key === "ArrowDown") {
          setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        }

        if (event.key === "ArrowUp") {
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        }

        if (event.key === "Enter" && highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [options, highlightedIndex, isOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (item: option) => {
    setSelected(item);

    const newIndex = options.findIndex((o) => o.value === item.value);
    setHighlightedIndex(newIndex);

    setIsOpen(false);

    onChange?.(item.value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect scroll to bottom
  const handleScroll = () => {
    if (dropdownRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 5 &&
        typeof onScrollToBottom === "function"
      ) {
        onScrollToBottom(); // update parent
      }
    }
  };

  return (
    <div className={`relative inline-block text-base ${width}`}>
      <div
        onClick={toggleDropdown}
        className={`flex justify-between items-center gap-2 px-2 py-1.5 border border-[var(--seperator-color)] ${
          isOpen ? "rounded-t" : "rounded"
        } bg-white shadow-md cursor-pointer`}
      >
        <span className="flex-grow">
          {selected?.name || "Select an option"}
        </span>
        <span className="text-gray-600 cursor-pointer">
          <FaChevronDown />
        </span>
      </div>

      {isOpen && (
        <ul
          ref={dropdownRef}
          onScroll={handleScroll}
          className="absolute top-full -mt-px w-full border border-[var(--seperator-color)] rounded-b bg-white max-h-[288px] overflow-y-auto shadow-md"
        >
          {options.map((item, index) => (
            <li
              key={item.value}
              onClick={() => handleSelect(item)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                highlightedIndex === index ? "bg-gray-200" : ""
              }`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
