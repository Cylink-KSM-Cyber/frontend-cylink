import React, { useState, useRef, useEffect } from "react";

/**
 * Prop types for SearchInput component
 */
interface SearchInputProps {
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Function to call when search value changes
   */
  onSearch: (value: string) => void;
  /**
   * Initial search value
   */
  initialValue?: string;
  /**
   * Debounce delay in milliseconds
   */
  debounceMs?: number;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * SearchInput Component
 * @description A search input with debounce functionality
 */
const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  onSearch,
  initialValue = "",
  debounceMs = 300,
  className = "",
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear existing timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timeout
    debounceTimerRef.current = setTimeout(() => {
      onSearch(newValue);
    }, debounceMs);
  };

  // Handle clear button click
  const handleClear = () => {
    setInputValue("");
    onSearch("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-[#607D8B]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>

      <input
        type="search"
        className="block w-full p-2 pl-10 pr-8 text-sm border border-[#E0E0E0] rounded-lg bg-white focus:ring-2 focus:ring-black focus:border-black transition-colors"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />

      {inputValue && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#607D8B] hover:text-[#333333]"
          onClick={handleClear}
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 12 12M1 13 13 1"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
