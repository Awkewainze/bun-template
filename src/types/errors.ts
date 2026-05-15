import type { ZodType, flattenError, output, treeifyError } from "zod";

export type ErrorResponseBody = {
	error: string;
};

export type ZodErrorResponseBody<TSchema extends ZodType> = {
	error: "Validation Error",
	zodError: {
		pretty: string,
		flatten: ReturnType<typeof flattenError<output<TSchema>>>
		tree: ReturnType<typeof treeifyError<output<TSchema>>>
	}
} & ErrorResponseBody;
