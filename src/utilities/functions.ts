import type { Provider } from "@/types";

export function noop(): void { }

export function provide<T>(value: T): Provider<T> {
	return () => value;
}
