import { beforeAll, afterAll, afterEach, jest } from "bun:test";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

global.ResizeObserver = class ResizeObserver {
	observe() { }
	unobserve() { }
	disconnect() { }
};

// Mock other APIs as needed
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

beforeAll(() => {
	// Set up test database
	// setupTestDatabase();
});

afterAll(() => {
	cleanup();
	// cleanupTestDatabase();
});

afterEach(() => {
	document.body.innerHTML = "";
});
