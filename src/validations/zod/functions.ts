import z from "zod";

/**
 * @example
 * ```ts
 * const zOrderBy = zOptionsDefaultFirst(["name", "date"]);
 * type zOrderByType = z.infer<typeof zOrderBy>;
 * ```
 * @param options Literal available options
 * @returns Zod Parser
 * @throws If options is invalid or empty
 */
export function zOptionsDefaultFirst<const T extends any[]>(options: T): z.ZodCatch<z.ZodDefault<z.ZodOptional<z.ZodLiteral<T[number]>>>> {
	if (!Array.isArray(options)) {
		throw new Error("Array is invalid");
	}

	if (options.length === 0) {
		throw new Error("Must have at least 1 option");
	}

	return z.literal(options)
		.optional()
		.default(options[0]!)
		.catch(options[0]!);
}
