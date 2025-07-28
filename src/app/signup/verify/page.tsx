"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailCheck, ArrowLeft } from "lucide-react";
import AuthCard from "@/components/common/auth-card";

const VerifyEmailContent = () =>  {

    const searchParams = useSearchParams();
    const userEmail = searchParams.get("email");

    return (
        <>
            <p className="mt-4 text-gray-600 max-w-xs">
                We've sent a verification link to <span className="font-semibold text-black">{userEmail || 'your email'}</span>. Please check your inbox and click the link to activate your account.
            </p>

            <p className="mt-8 text-xs text-gray-500">
                Can't find the email? Check your spam folder.
            </p>

            <footer className="mt-8 pt-4 border-t border-gray-200 w-full">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black">
                    <ArrowLeft size={16} />
                    Back to Login
                </Link>
            </footer>
        </>
    );
};

const VerifyEmailPage = () => {
    return (
        <AuthCard
            icon={<MailCheck className="h-12 w-12" />}
            title="Verify your email"
        >
            <Suspense fallback={<p className="mt-4 text-gray-600">Loading...</p>}>
                <VerifyEmailContent />
            </Suspense>
        </AuthCard>
    );
}

export default VerifyEmailPage;