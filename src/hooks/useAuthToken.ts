import type { EncodedJWT } from "@/types";
import { useLocalStorage } from "usehooks-ts";

export function useAuthToken() {
	return useLocalStorage<EncodedJWT | null>("auth-token-jwt", null);
}
