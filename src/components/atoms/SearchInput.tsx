import React, { useState, useRef, useEffect } from "react";
import logger from "@/utils/logger";

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

  // Keep track of last search value to avoid unnecessary callbacks
  const lastSearchValueRef = useRef<string>(initialValue);

  // Set initial value when it changes from parent
  useEffect(() => {
    if (initialValue !== inputValue) {
      setInputValue(initialValue);
      logger.debug("SearchInput initialValue changed", { initialValue });
    }
  }, [initialValue]);

  // Clear debounce timer on unmount
  useEffect(() => {
    logger.debug("SearchInput component mounted");
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        logger.debug("SearchInput component unmounted and timer cleared");
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
      // Only call onSearch if the value has actually changed from last search
      if (newValue !== lastSearchValueRef.current) {
        lastSearchValueRef.current = newValue;
        onSearch(newValue);
        logger.debug("SearchInput debounce triggered search", {
          value: newValue,
        });
      }
    }, debounceMs);
  };

  // Handle clear button click with explicit logging
  const handleClear = () => {
    // Clear existing timeout to prevent race conditions
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setInputValue("");

    // Only trigger search if it's different from last search value
    if (lastSearchValueRef.current !== "") {
      lastSearchValueRef.current = "";
      onSearch("");
      logger.userAction("SearchInput clear button clicked");
    }
  };

  // Handle form submission (prevent default)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only trigger search if it's different from last search value
    if (inputValue !== lastSearchValueRef.current) {
      lastSearchValueRef.current = inputValue;
      onSearch(inputValue);
      logger.userAction("SearchInput form submitted", { value: inputValue });
    }
  };

  // CSS to hide browser's native clear button on search inputs
  const searchInputStyles = `
    /* Hide clear button in Chrome, Safari */
    input[type="search"]::-webkit-search-cancel-button {
      -webkit-appearance: none;
      display: none;
    }
    
    /* Hide clear button in Edge */
    input[type="search"]::-ms-clear {
      display: none;
    }
  `;

  return (
    <form className={`relative ${className}`} onSubmit={handleSubmit}>
      {/* Add style tag to hide native clear button */}
      <style>{searchInputStyles}</style>

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
        type="text"
        className="block w-full p-2 pl-10 pr-8 text-sm border border-[#E0E0E0] rounded-lg bg-white focus:ring-2 focus:ring-black focus:border-black transition-colors"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          // Handle Enter key by preventing default form submission
          if (e.key === "Enter") {
            e.preventDefault();

            // Only trigger search if it's different from last search value
            if (inputValue !== lastSearchValueRef.current) {
              lastSearchValueRef.current = inputValue;
              onSearch(inputValue);
              logger.userAction("SearchInput enter key pressed", {
                value: inputValue,
              });
            }
          }
        }}
      />

      {inputValue && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#607D8B] hover:text-[#333333]"
          onClick={handleClear}
          aria-label="Clear search"
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
    </form>
  );
};

export default SearchInput;
