import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface DropdownOption {
    value: string;
    label: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    placement?: "top" | "right" | "bottom" | "left";
    size?: "default" | "compact";
    className?: string;
}

export default function Dropdown({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    disabled = false,
    placement = "bottom",
    size = "default",
    className = "",
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(
        (option) => option.value === value
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    function handleSelect(option: DropdownOption) {
        onChange(option.value);
        setIsOpen(false);
    }

    return (
        <div
            ref={dropdownRef}
            className="relative"
        >
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen((prev) => !prev)}
                className={`
                    flex w-full items-center justify-between gap-2
                    ${
                        size === "compact"
                            ? "rounded-lg px-3 py-2 text-sm"
                            : "select-modern"
                    }
                    ${
                        disabled
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                    }
                    ${
                        size === "default" && isOpen
                            ? "border-gray-400 ring-4 ring-gray-100"
                            : ""
                    }
                    ${className}
                `}
            >
                <span
                    className={`
                        truncate
                        ${
                            selectedOption
                                ? "text-inherit"
                                : "text-gray-400"
                        }
                    `}
                >
                    {selectedOption?.label ?? placeholder}
                </span>

                <ChevronDown
                    className={`
                        h-4 w-4 shrink-0
                        transition-transform duration-200
                        ${isOpen ? "rotate-180" : ""}
                    `}
                />
            </button>

            {isOpen && !disabled && (
                <div
                    className={`
                        absolute left-0 z-50 w-full
                        rounded-xl border border-gray-200
                        bg-white p-1 shadow-lg
                        ${
                            placement === "top"
                                ? "bottom-full mb-2"
                                : placement === "right"
                                  ? "left-full top-0"
                                  : placement === "left"
                                    ? "right-full top-0"
                                    : "top-full mt-2"
                        }
                    `}
                >
                    <div className="max-h-[300px] dropdown-scroll">
                        {options.map((option) => {
                            const isSelected =
                                option.value === value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                        handleSelect(option)
                                    }
                                    className={`
                                        flex w-full items-center justify-between
                                        rounded-lg px-3 py-2.5
                                        text-left text-sm
                                        cursor-pointer
                                        transition-colors duration-150
                                        ${
                                            isSelected
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:bg-gray-50"
                                        }
                                    `}
                                >
                                    <span>{option.label}</span>

                                    {isSelected && (
                                        <Check className="h-4 w-4 text-blue-500" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}