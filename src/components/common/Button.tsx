// frontend/src/components/common/Button.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    isLoading,
    className,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg',
        secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-600'
    };

    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                className
            )}
            disabled={isLoading || props.disabled}
            type={props.type}
            onClick={props.onClick}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            {children}
        </motion.button>
    );
};
