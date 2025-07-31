import React, { ChangeEvent } from "react";
import { DisciplineData } from "@/app/disciplines/[disciplineId]/edit/page";

interface FormFieldProps {
    label: string;
    name: keyof DisciplineData;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    placeholder?: string;
    as?: 'input' | 'textarea';
    rows?: number;
}

const FormField = ({ label, as = 'input', ...props }: FormFieldProps) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {as === 'textarea' ? (
            <textarea id={props.name} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required {...props} />
        ) : (
            <input id={props.name} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required {...props} />
        )}
    </div>
);

export default FormField;