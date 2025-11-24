'use client';

import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    hoverable?: boolean;
}

export default function Card({
    children,
    hoverable = false,
    className = '',
    ...props
}: CardProps) {
    return (
        <motion.div
            className={`card-glass p-6 ${hoverable ? 'cursor-pointer' : ''} ${className}`}
            whileHover={hoverable ? { scale: 1.02, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)' } : {}}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
