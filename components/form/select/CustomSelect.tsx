import { useDebounce } from "@/hooks/debounce";
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
  e2e?: string;
  onChange?: (value: string | number) => void;
  onScrollToBottom?: () => void;
  onSearchChanged?: (searchTerm: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  width = "",
  e2e = "",
  onChange,
  onScrollToBottom,
  onSearchChanged,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selected, setSelected] = useState<option | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search);

  const dropdownRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value) {
      const selectedItem = options.find((opt) => opt.value === value);
      if (selectedItem) {
        setSelected(selectedItem);
      }
    }
  }, [value, options]);

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

  useEffect(() => {
    onSearchChanged?.(debouncedSearch);
  }, [debouncedSearch]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (item: option) => {
    setSelected(item);

    const newIndex = options.findIndex((o) => o.value === item.value);
    setHighlightedIndex(newIndex);

    setIsOpen(false);

    onChange?.(item.value);
  };

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target instanceof HTMLElement)) return;

      if (
        document.body.contains(event.target) &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsFocused(false);
        setIsOpen(false);
      }
    }

    if (isFocused) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFocused, wrapperRef]);

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-block text-base text-[var(--text-color)] ${width}`}
      data-e2e={e2e}
    >
      <div
        onClick={(e) => {
          setIsFocused(true);
          toggleDropdown();
        }}
        className={`flex justify-between items-center gap-2 px-2 py-1.5 border border-[var(--seperator-color)] bg-white shadow-md cursor-pointer
          ${isFocused ? "outline outline-2 outline-offset-[-2px]" : ""}
          ${isOpen ? "rounded-t" : "rounded"}
        `}
      >
        {isOpen ? (
          <input
            type="text"
            className="flex-grow border-none focus:outline-none"
            value={search}
            placeholder="Search..."
            autoFocus
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onBlur={(e) => e.stopPropagation}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-grow">
            {selected?.name || "Select an option"}
          </span>
        )}
        <span className="text-gray-600 cursor-pointer">
          <FaChevronDown />
        </span>
      </div>

      {isOpen && (
        <ul
          ref={dropdownRef}
          onScroll={handleScroll}
          className="absolute top-full w-full border border-[var(--seperator-color)] rounded-b bg-white max-h-[288px] overflow-y-auto shadow-md"
        >
          {options.map((item, index) => (
            <li
              key={item.value}
              onMouseDown={() => handleSelect(item)}
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
