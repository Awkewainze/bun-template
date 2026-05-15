import { test, expect } from "bun:test";

test("dom test", () => {
	document.body.innerHTML = `<button>My button</button>`;
	const button = document.querySelector("button");
	expect(button?.innerText).toEqual("My button");
});

test("button click event", () => {
	let clicked = false;

	document.body.innerHTML = '<button id="test-btn">Click me</button>';
	const button = document.getElementById("test-btn");

	button?.addEventListener("click", () => {
		clicked = true;
	});

	button?.click();
	expect(clicked).toBe(true);
});
