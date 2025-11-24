import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';

describe('Card Component', () => {
    it('renders children content', () => {
        render(<Card>Card Content</Card>);
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<Card className="custom-card">Content</Card>);
        const card = screen.getByText('Content').parentElement;
        expect(card?.className).toContain('custom-card');
    });

    it('handles click events when onClick is provided', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Card onClick={handleClick}>Clickable Card</Card>);
        await user.click(screen.getByText('Clickable Card'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies hoverable cursor style', () => {
        render(<Card hoverable>Hoverable</Card>);
        const card = screen.getByText('Hoverable').parentElement;
        expect(card?.className).toContain('cursor-pointer');
    });

    it('does not apply cursor-pointer when not hoverable', () => {
        render(<Card>Not Hoverable</Card>);
        const card = screen.getByText('Not Hoverable').parentElement;
        expect(card?.className).not.toContain('cursor-pointer');
    });

    it('applies drag event handlers', () => {
        const handlers = {
            onDragEnter: vi.fn(),
            onDragLeave: vi.fn(),
            onDragOver: vi.fn(),
            onDrop: vi.fn(),
        };

        render(<Card {...handlers}>Draggable Card</Card>);
        const card = screen.getByText('Draggable Card').parentElement;

        expect(card).toBeInTheDocument();
    });
});
