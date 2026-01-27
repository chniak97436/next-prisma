'use client';
import React from 'react';
import Link from 'next/link';

export default function Button({ children, type = 'submit', onClick, disabled = false, as, href }) {
    const buttonElement = (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`relative mx-2 flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-300 shadow-lg hover:shadow-xl ${
                disabled
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105'
            }`}
        >
            {children}
        </button>
    );

    if (as === Link && href) {
        return (
            <Link href={href} className="animate-fade-in">
                {buttonElement}
            </Link>
        );
    }

    return (
        <div className="animate-fade-in">
            {buttonElement}
        </div>
    );
}
