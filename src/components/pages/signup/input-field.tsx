import React, { ChangeEvent } from "react";
import { UserSignUpData } from "@/app/signup/page";

interface InputFieldProps {
	label: string;
	name: keyof UserSignUpData;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	type?: string;
	required?: boolean;
}

const InputField = ({ label, name, value, onChange, type = "text", required = true }: InputFieldProps) => (
	<div>
		<label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
		<input
			type={type}
			name={name}
			value={value}
			onChange={onChange}
			className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
			required={required}
		/>
	</div>
);

export default InputField;