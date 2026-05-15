import type { DecodedJWT } from "@/types";
import { useAuthToken } from "./useAuthToken";
import { decodeJwt } from "jose";

export function useCurrentUser(): DecodedJWT | null {
	const [token] = useAuthToken();

	if (!token) {
		return null;
	}
	return decodeJwt(token);
}
