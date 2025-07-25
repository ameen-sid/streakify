"use client";

import React from 'react';
import { ShieldOff, Home } from "lucide-react";

const AccountDeletedPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg flex flex-col items-center text-center overflow-hidden p-8 sm:p-12">
                
                {/* Icon */}
                <div className="bg-black text-white p-4 rounded-full mb-6">
                    <ShieldOff className="h-12 w-12" />
                </div>

                {/* Main Content */}
                <main className="flex-grow flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-black">Account Deletion Scheduled</h1>
                    <p className="mt-4 text-gray-600 max-w-xs">
                        Your account is now scheduled for deletion. In 30 days, your account and all associated data, including your disciplines and tasks, will be permanently deleted. If you want to recover your account, please check the email we've sent you.
                    </p>

                    {/* Back to Home Button */}
                    <div className="mt-8 w-full">
                        <a
                            href="/"
                            className="w-full inline-flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                            <Home size={20} className="mr-2" />
                            Back to Homepage
                        </a>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default AccountDeletedPage;