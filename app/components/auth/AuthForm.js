'use client';
import React from 'react';

export default function AuthForm({ title, children, onSubmit, errorMessage, successMessage }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 animate-fade-in">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl animate-bounce-in border border-gray-200">
                <h1 className="text-2xl font-bold text-center text-gray-900 animate-slide-in-left">{title}</h1>

                {successMessage && (
                    <div className="p-4 text-sm text-green-800 bg-green-200 rounded-lg animate-fade-in border-l-4 border-green-600" role="alert">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg animate-fade-in border-l-4 border-red-500" role="alert">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6 animate-fade-in">
                    {children}
                </form>
            </div>
        </div>
    );
}
