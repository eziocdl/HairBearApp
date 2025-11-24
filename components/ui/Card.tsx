'use client';

import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    hoverable?: boolean;
    onClick?: () => void;
    className?: string;
    onDragEnter?: React.DragEventHandler<HTMLDivElement>;
    onDragLeave?: React.DragEventHandler<HTMLDivElement>;
    onDragOver?: React.DragEventHandler<HTMLDivElement>;
    onDrop?: React.DragEventHandler<HTMLDivElement>;
}

export default function Card({
    children,
    hoverable = false,
    onClick,
    className = '',
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
}: CardProps) {
    return (
        <motion.div
            onClick={onClick}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`card-glass p-6 ${hoverable ? 'cursor-pointer' : ''} ${className}`}
            whileHover={hoverable ? { scale: 1.02, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)' } : {}}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.div>
    );
}
