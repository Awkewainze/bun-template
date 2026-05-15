import type { ErrorResponseBody, ZodErrorResponseBody } from "@/types/errors";

export async function extractErrorText<TError extends ErrorResponseBody = ErrorResponseBody>(response: Response | TError): Promise<string | null> {
	try {
		let responseBody: TError;
		if (response instanceof Response) {
			responseBody = await response.json();
		} else {
			responseBody = response;
		}

		if ((responseBody as unknown as ZodErrorResponseBody<any>).zodError != null) {
			return (responseBody as unknown as ZodErrorResponseBody<any>).zodError.pretty;
		}

		if (responseBody.error != null) {
			return responseBody.error;
		}

		if (response instanceof Response) {
			return response.statusText;
		}

		return null;
	} catch (error) {
		console.error("Error extracting error text", error);
		if (response instanceof Response) {
			return response.statusText;
		}

		return null;
	}
}
