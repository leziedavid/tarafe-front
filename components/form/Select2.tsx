'use client';

import * as React from "react";
import { Check, ChevronsUpDown, CircleX } from "lucide-react";

// Interfaces
interface BaseComboboxProps<T> {
    options: T[];
    labelExtractor: (item: T) => string;
    valueExtractor: (item: T) => string;
    placeholder?: string;
    disabled?: boolean;
}

interface SingleSelectProps<T> extends BaseComboboxProps<T> {
    mode?: 'single';
    selectedItem: string | null;
    onSelectionChange: (selectedItem: string | null) => void;
}

interface MultipleSelectProps<T> extends BaseComboboxProps<T> {
    mode: 'multiple';
    selectedItem: string[] | null;
    onSelectionChange: (selectedItem: string[] | null) => void;
}

type ComboboxProps<T> = SingleSelectProps<T> | MultipleSelectProps<T>;

export function Select2<T>(props: ComboboxProps<T>) {
    const {
        options,
        labelExtractor,
        valueExtractor,
        placeholder = "Sélectionner...",
        disabled = false,
    } = props;

    const mode = 'mode' in props ? props.mode : 'single';
    const selectedItem = 'selectedItem' in props ? props.selectedItem : null;
    const onSelectionChange = 'onSelectionChange' in props ? props.onSelectionChange : () => { };

    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const popoverRef = React.useRef<HTMLDivElement>(null);

    const isMultipleMode = mode === 'multiple';

    // Fermer le popover en cliquant à l'extérieur
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    // Ne pas ouvrir le popover si désactivé
    const handleOpen = () => {
        if (!disabled) {
            setOpen(!open);
        }
    };

    const isSelected = (value: string): boolean => {
        if (isMultipleMode) {
            return Array.isArray(selectedItem) && selectedItem.includes(value);
        } else {
            return selectedItem === value;
        }
    };

    const handleSelection = (value: string) => {
        if (disabled) return;

        if (isMultipleMode) {
            const currentSelection = Array.isArray(selectedItem) ? selectedItem : [];

            if (currentSelection.includes(value)) {
                const newSelection = currentSelection.filter(item => item !== value);
                (onSelectionChange as (selected: string[] | null) => void)(
                    newSelection.length > 0 ? newSelection : null
                );
            } else {
                const newSelection = [...currentSelection, value];
                (onSelectionChange as (selected: string[] | null) => void)(newSelection);
            }
        } else {
            (onSelectionChange as (selected: string | null) => void)(
                value === selectedItem ? null : value
            );
            setOpen(false);
        }
    };

    const handleRemoveSelection = (e: React.MouseEvent, value?: string) => {
        if (disabled) return;

        e.stopPropagation();

        if (isMultipleMode && value) {
            const currentSelection = Array.isArray(selectedItem) ? selectedItem : [];
            const newSelection = currentSelection.filter(item => item !== value);
            (onSelectionChange as (selected: string[] | null) => void)(
                newSelection.length > 0 ? newSelection : null
            );
        } else {
            if (isMultipleMode) {
                (onSelectionChange as (selected: string[] | null) => void)(null);
            } else {
                (onSelectionChange as (selected: string | null) => void)(null);
            }
        }
    };

    const getFilteredOptions = () => {
        let availableOptions = options;

        if (isMultipleMode) {
            const selectedValues = Array.isArray(selectedItem) ? selectedItem : [];
            availableOptions = options.filter((option) => {
                const value = valueExtractor(option);
                return !selectedValues.includes(value);
            });
        } else {
            availableOptions = options.filter((option) => {
                const value = valueExtractor(option);
                return value !== selectedItem;
            });
        }

        // Filtrer par recherche
        if (searchQuery) {
            return availableOptions.filter((option) =>
                labelExtractor(option).toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return availableOptions;
    };

    const renderSelectedDisplay = () => {
        if (isMultipleMode) {
            const selectedValues = Array.isArray(selectedItem) ? selectedItem : [];
            if (selectedValues.length === 0) {
                return <span className={`${disabled ? 'text-gray-400' : 'text-gray-500'}`}>{placeholder}</span>;
            }

            const selectedItems = options.filter(option =>
                selectedValues.includes(valueExtractor(option))
            );

            return (
                <div className="flex items-center space-x-2 flex-wrap gap-1">
                    {selectedItems.slice(0, 3).map((item) => (
                        <div
                            key={valueExtractor(item)}
                            className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded"
                        >
                            <span>{labelExtractor(item)}</span>
                            {!disabled && (
                                <CircleX
                                    className="cursor-pointer text-gray-500 h-3 w-3 ml-1 hover:text-gray-700"
                                    onClick={(e) => handleRemoveSelection(e, valueExtractor(item))}
                                />
                            )}
                        </div>
                    ))}
                    {selectedItems.length > 3 && (
                        <span className="text-sm text-gray-600">
                            +{selectedItems.length - 3} autres
                        </span>
                    )}
                    {!disabled && selectedItems.length > 0 && (
                        <CircleX
                            className="cursor-pointer text-black h-4 w-4 hover:text-gray-700"
                            onClick={(e) => handleRemoveSelection(e)}
                        />
                    )}
                </div>
            );
        } else {
            if (!selectedItem || typeof selectedItem !== 'string') {
                return <span className={`${disabled ? 'text-gray-400' : 'text-gray-500'}`}>{placeholder}</span>;
            }

            const item = options.find(option => valueExtractor(option) === selectedItem);
            return item ? (
                <div className="flex items-center space-x-2">
                    <span className={disabled ? 'text-gray-600' : ''}>{labelExtractor(item)}</span>
                    {!disabled && (
                        <CircleX
                            className="cursor-pointer text-black h-4 w-4 hover:text-gray-700"
                            onClick={(e) => handleRemoveSelection(e)}
                        />
                    )}
                </div>
            ) : (
                <span className={`${disabled ? 'text-gray-400' : 'text-gray-500'}`}>{placeholder}</span>
            );
        }
    };

    const filteredOptions = getFilteredOptions();

    return (
        <div className="relative w-full" ref={popoverRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={handleOpen}
                disabled={disabled}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${disabled
                        ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-300 hover:bg-gray-50 focus:ring-gray-500 focus:border-transparent cursor-pointer'
                    }`}
            >
                <div className="flex items-center space-x-2 flex-wrap truncate flex-1">
                    {renderSelectedDisplay()}
                </div>
                <ChevronsUpDown className={`h-4 w-4 ml-2 flex-shrink-0 ${disabled ? 'opacity-30' : 'opacity-50'
                    }`} />
            </button>

            {/* Popover Content */}
            {open && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                    </div>

                    {/* Options List */}
                    <div className="max-h-64 overflow-y-auto p-1">
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                Aucune option trouvée.
                            </div>
                        ) : (
                            filteredOptions.map((option) => {
                                const value = valueExtractor(option);
                                const label = labelExtractor(option);
                                const selected = isSelected(value);

                                return (
                                    <div
                                        key={value}
                                        onClick={() => handleSelection(value)}
                                        className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded hover:bg-gray-100 transition-colors"
                                    >
                                        <span className={selected ? 'font-medium' : ''}>
                                            {label}
                                        </span>
                                        <Check
                                            className={`h-4 w-4 transition-opacity ${selected ? 'opacity-100' : 'opacity-0'
                                                }`}
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}