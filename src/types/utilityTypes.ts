// Source - https://stackoverflow.com/a/58436959
// Posted by jcalz, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-25, License - CC BY-SA 4.0
export type Paths<T> = T extends object ? { [K in keyof T]:
	`${Exclude<K, symbol>}${"" | `.${Paths<T[K]>}`}`
}[keyof T] : never

export type Leaves<T> = T extends object ? { [K in keyof T]:
	`${Exclude<K, symbol>}${Leaves<T[K]> extends never ? "" : `.${Leaves<T[K]>}`}`
}[keyof T] : never
// end attribution

/**
 * @example
 * type Id = ValueType<string, "Id">;
 */
export type ValueType<BaseType, ValueName extends string> = BaseType & {
	/**
	 * Hacky way to do value types
	 * @deprecated This will never actually be set
	 */
	readonly __ignore: ValueName
};

export type Callback = () => void;
export type Predicate<T> = (value: T) => boolean;
export type Provider<T> = () => T;
export type Consumer<T> = (value: T) => void;
export type Mapper<T, U> = (value: T) => U;
export type AsyncCallback = () => Promise<void>;
export type AsyncPredicate<T> = (value: T) => Promise<boolean>;
export type AsyncProvider<T> = () => Promise<T>;
export type AsyncConsumer<T> = (value: T) => Promise<void>;
export type AsyncMapper<T, S> = (value: T) => Promise<S>;
