import { ChangeEvent, ReactNode } from "react";

// Input Field Component
interface InputFieldProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}
const InputField = ({ label, type = "text", value, onChange, placeholder = "" }: InputFieldProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={label}>{label}</label>
    <input
      id={label}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

// Select Field Component
interface SelectOption {
  label: string;
  value: string;
}
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[] | SelectOption[];
}
const SelectField = ({ label, value, onChange, options }: SelectFieldProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={label}>{label}</label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map((option) =>
        typeof option === "string" ? (
          <option key={option} value={option}>{option}</option>
        ) : (
          <option key={option.value} value={option.value}>{option.label}</option>
        )
      )}
    </select>
  </div>
);

// Checkbox Field Component
interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const CheckboxField = ({ label, checked, onChange }: CheckboxFieldProps) => (
  <div className="flex items-center mb-4">
    <input
      id={label}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
    <label htmlFor={label} className="ml-2 block text-sm text-gray-700">{label}</label>
  </div>
);

// Button Component
interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}
const Button = ({ type = "button", onClick, className, children }: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      className || "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
    }`}
  >
    {children}
  </button>
);

export { InputField, SelectField, CheckboxField, Button };
