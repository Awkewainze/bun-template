import type { ZodErrorResponseBody } from "@/types";
import z, { flattenError, prettifyError, treeifyError, ZodError, ZodType, type output } from "zod";

export function toValidationResponseBody<TSchema extends ZodType, TParseError extends ZodError<output<TSchema>>>(zodParseError: TParseError): ZodErrorResponseBody<TSchema> {
	return {
		error: "Validation Error",
		zodError: {
			pretty: prettifyError(zodParseError),
			flatten: flattenError(zodParseError),
			tree: treeifyError(zodParseError)
		}
	}
}
