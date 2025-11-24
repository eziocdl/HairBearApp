'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    icon?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    'aria-label'?: string;
    'data-testid'?: string;
}

export default function Button({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    type = 'button',
    icon,
    className = '',
    style,
    id,
    'aria-label': ariaLabel,
    'data-testid': dataTestId,
}: ButtonProps) {
    const baseClasses = 'font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2';

    const variantClasses = {
        primary: 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
        secondary: 'border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'text-slate-300 hover:bg-slate-800',
    };

    const sizeClasses = {
        sm: 'py-2 px-4 text-sm',
        md: 'py-3 px-6 text-base',
        lg: 'py-4 px-8 text-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
            style={style}
            id={id}
            aria-label={ariaLabel}
            data-testid={dataTestId}
            whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
        >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {!loading && icon}
            {children}
        </motion.button>
    );
}
