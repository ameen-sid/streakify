import React, { useState, ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PasswordsType } from "@/app/dashboard/profile/change-password/page";

interface PasswordFieldProps {
    label: string;
    name: keyof PasswordsType;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInputField = ({ label, name, value, onChange }: PasswordFieldProps) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <input
                    type={isVisible ? "text" : "password"}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500"
                >
                    {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
    );
};

export default PasswordInputField;