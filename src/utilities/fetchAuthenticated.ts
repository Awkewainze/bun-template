import type { EncodedJWT } from "@/types";
import type { HttpMethod } from "./http";

export async function fetchAuthenticated({ url, token, method = "GET", data }: { url: URL, token: EncodedJWT, method?: keyof typeof HttpMethod, data?: object }) {
	return await fetch(url, {
		method,
		headers: {
			"Authorization": "Bearer " + token,
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		body: (data && JSON.stringify(data))
	});
}
