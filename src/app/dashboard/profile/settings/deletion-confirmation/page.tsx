"use client";

import React from "react";
import { ShieldOff } from "lucide-react";
import AuthCard from "@/components/common/auth-card";
import AuthButton from "@/components/common/auth-button";

const AccountDeletedPage = () => {
    return (
        <AuthCard
            icon={<ShieldOff className="h-12 w-12" />}
            title="Account Deletion Scheduled"
        >
            <p className="mt-4 text-gray-600 max-w-xs">
                Your account is now scheduled for deletion. In 30 days, all your data will be permanently deleted. If you want to recover your account, please check the email we&apos;ve sent you.
            </p>

            <div className="mt-8 w-full">
                <AuthButton href="/">
                    Back to Homepage
                </AuthButton>
            </div>
        </AuthCard>
    );
};

export default AccountDeletedPage;