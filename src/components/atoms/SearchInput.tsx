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

  // Keep track of last search value to avoid unnecessary callbacks
  const lastSearchValueRef = useRef<string>(initialValue);

  // Set initial value when it changes from parent
  useEffect(() => {
    if (initialValue !== inputValue) {
      console.log("SearchInput: initialValue changed", {
        initialValue,
        inputValue,
      });
      setInputValue(initialValue);
      // Only update last search value if it's an explicit update from parent
      lastSearchValueRef.current = initialValue;
    }
  }, [initialValue]);

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

    console.log("SearchInput: value changed", {
      from: inputValue,
      to: newValue,
    });

    setInputValue(newValue);

    // Clear existing timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timeout
    debounceTimerRef.current = setTimeout(() => {
      // Only call onSearch if the value has actually changed from last search
      if (newValue !== lastSearchValueRef.current) {
        console.log("SearchInput: executing search", {
          value: newValue,
          lastSearchValue: lastSearchValueRef.current,
        });
        lastSearchValueRef.current = newValue;
        onSearch(newValue);
      } else {
        console.log("SearchInput: skipping search (no change)", {
          value: newValue,
        });
      }
    }, debounceMs);
  };

  // Handle clear button click with explicit logging
  const handleClear = () => {
    console.log("SearchInput: clear button clicked");

    // Clear existing timeout to prevent race conditions
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setInputValue("");

    // Only trigger search if it's different from last search value
    if (lastSearchValueRef.current !== "") {
      console.log("SearchInput: triggering empty search after clear");
      lastSearchValueRef.current = "";
      onSearch("");
    } else {
      console.log("SearchInput: skipping empty search (already empty)");
    }
  };

  // Handle form submission (prevent default)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only trigger search if it's different from last search value
    if (inputValue !== lastSearchValueRef.current) {
      console.log("SearchInput: form submitted with new search", {
        value: inputValue,
      });
      lastSearchValueRef.current = inputValue;
      onSearch(inputValue);
    } else {
      console.log(
        "SearchInput: form submitted with unchanged search (skipping)",
        { value: inputValue }
      );
    }
  };

  return (
    <form className={`relative ${className}`} onSubmit={handleSubmit}>
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
        onKeyDown={(e) => {
          // Handle Enter key by preventing default form submission
          if (e.key === "Enter") {
            e.preventDefault();

            // Only trigger search if it's different from last search value
            if (inputValue !== lastSearchValueRef.current) {
              console.log("SearchInput: Enter key pressed with new search", {
                value: inputValue,
              });
              lastSearchValueRef.current = inputValue;
              onSearch(inputValue);
            } else {
              console.log(
                "SearchInput: Enter key pressed with unchanged search (skipping)",
                { value: inputValue }
              );
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
