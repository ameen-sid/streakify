import React from "react";
import { useSearchParams } from "next/navigation";

const VerifyEmailContent = () => {

    const searchParams = useSearchParams(); 
    const userEmail = searchParams.get("email");

    return (
        <>
            <p className="text-gray-400">
                We've sent a verification link to{' '}
                <span className="font-semibold text-blue-400">{userEmail || 'your email'}</span>.
                Please check your inbox and click the link to activate your account.
            </p>
            <p className="mt-6 text-sm text-gray-500">
                Can't find the email? Be sure to check your spam folder.
            </p>
        </>
    );
};

export default VerifyEmailContent;