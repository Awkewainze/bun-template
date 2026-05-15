import { useState, useEffect, useCallback } from "react";
import { useAuthToken } from "./useAuthToken";
import { HttpMethod, HttpStatus } from "@/utilities/http";
import { fetchAuthenticated, noop } from "@/utilities";
import { useNavigate } from "react-router";
import type { Consumer, ErrorResponseBody } from "@/types";

export function useAuthenticatedApiRequest<TResponse extends object, TError extends ErrorResponseBody = ErrorResponseBody>(url: URL, method: keyof typeof HttpMethod = "GET", data?: object, onSuccess?: Consumer<TResponse>, onError?: Consumer<TError>) {
	const { triggerFn, response, errorResponse, loading, manualSets } = useCallbackAuthenticatedApiRequest<TResponse, TError>(url, method, data, onSuccess, onError);
	const [token] = useAuthToken();

	useEffect(() => {
		triggerFn();
	}, [token, method, url, data]);

	return { response, errorResponse, loading, manualSets };
}

export function useCallbackAuthenticatedApiRequest<TResponse extends object, TError extends ErrorResponseBody = ErrorResponseBody>(url: URL, method: keyof typeof HttpMethod = "GET", data?: object, onSuccess?: Consumer<TResponse>, onError?: Consumer<TError>) {
	const [response, setResponse] = useState<TResponse | null>(null);
	const [errorResponse, setErrorResponse] = useState<TError | null>(null);
	const [loading, setLoading] = useState(false);
	const [token] = useAuthToken();
	const navigate = useNavigate();

	const successCb = onSuccess ?? noop;
	const errorCb = onError ?? noop;

	async function fetchWithToken() {
		setResponse(null);
		setErrorResponse(null);
		setLoading(true);

		if (!token) {
			const errorObj = { error: "Token missing" } as TError;
			setErrorResponse(errorObj);
			setLoading(false);
			errorCb(errorObj);
			return;
		}

		const fetchResponse = await fetchAuthenticated({ url, token, method, data });

		if (fetchResponse.ok) {
			const responseObj = await fetchResponse.json();
			setResponse(responseObj);
			setErrorResponse(null);
			setLoading(false);
			successCb(responseObj);
			return;
		}

		// token was denied by server, redirect to TokenInvalid page
		if (fetchResponse.status === HttpStatus.UNAUTHORIZED) {
			const errorObj = { error: "Token missing" } as TError;
			setErrorResponse(errorObj);
			setResponse(null);
			setLoading(false);
			errorCb(errorObj);
			navigate("/auth/token-invalid");
			return;
		}

		const errorObj = await fetchResponse.json();
		setErrorResponse(errorObj);
		setResponse(null);
		setLoading(false);
		errorCb(errorObj);
	}

	const triggerFn = useCallback(() => {
		fetchWithToken();
	}, [url, method, token, data]);


	return { triggerFn, response, errorResponse, loading, manualSets: { setResponse, setErrorResponse, setLoading } };
}
