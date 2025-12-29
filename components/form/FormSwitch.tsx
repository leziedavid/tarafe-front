// FormSwitch.tsx - Version corrigée
"use client";

import { FieldValues, Path } from "react-hook-form";

interface FormSwitchProps<T extends FieldValues> {
    name: Path<T>;
    value: number; // 0 ou 1
    onChange: (value: number) => void;
    label: string;
    description?: string;
    color?: "blue" | "green" | "red" | "yellow";
    disabled?: boolean;
}

export function FormSwitch<T extends FieldValues>({
    name,
    value,
    onChange,
    label,
    description,
    color = "blue",
    disabled = false,
}: FormSwitchProps<T>) {
    const colorClasses = {
        blue: "peer-checked:bg-brand-primary",
        green: "peer-checked:bg-green-500",
        red: "peer-checked:bg-red-500",
        yellow: "peer-checked:bg-yellow-500",
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        onChange(checked ? 1 : 0);
    };

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
                <label
                    htmlFor={String(name)}
                    className="block text-sm font-medium text-gray-900 mb-1 cursor-pointer"
                >
                    {label}
                </label>
                {description && (
                    <p className="text-sm text-gray-600">{description}</p>
                )}
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    id={String(name)}
                    checked={value === 1}
                    onChange={handleChange}
                    disabled={disabled}
                    className="sr-only peer"
                />
                <div className={`
                    w-11 h-6 bg-gray-300 rounded-full peer 
                    peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-brand-primary/30
                    ${colorClasses[color]}
                    peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                    after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                    after:bg-white after:rounded-full after:h-5 after:w-5
                    after:transition-all peer-checked:after:translate-x-full
                    peer-checked:after:border-white transition-colors duration-200
                `}></div>
            </label>
        </div>
    );
}