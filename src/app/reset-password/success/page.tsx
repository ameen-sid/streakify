"use client";

import React from "react";
import SparkleIcon from "@/components/icons/sparkle-icon";
import AuthCard from "@/components/common/auth-card";
import AuthButton from "@/components/common/auth-button";

const PasswordChangeConfirmationPage = () => {
	return (
        <AuthCard
            icon={<SparkleIcon className="h-12 w-12" />}
            title="Password changed"
        >
            <p className="mt-2 text-gray-600 max-w-xs">
                Your password has been changed successfully
            </p>
            <div className="mt-8 w-full">
                <AuthButton href="/login">
                    Back to login
                </AuthButton>
            </div>
        </AuthCard>
    );
};

export default PasswordChangeConfirmationPage;