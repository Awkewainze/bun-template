import { test, expect, jest } from 'bun:test';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

function Button({ children }: { children: React.ReactNode }) {
	return <button>{children}</button>;
}

test('renders button', () => {
	const rendered = render(<Button>Click me</Button>);
	expect(screen.getByRole('button').textContent).toBe("Click me");
});
