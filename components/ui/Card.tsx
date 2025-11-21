'use client';

import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    hoverable?: boolean;
    onClick?: () => void;
    className?: string;
}

export default function Card({ children, hoverable = false, onClick, className = '' }: CardProps) {
    return (
        <motion.div
            onClick={onClick}
            className={`card-glass p-6 ${hoverable ? 'cursor-pointer' : ''} ${className}`}
            whileHover={hoverable ? { scale: 1.02, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)' } : {}}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.div>
    );
}
