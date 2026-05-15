import { type JWTPayload } from "jose";
import type { Name, UserId, Username } from "./valueTypes";

export type DecodedJWT = JWTPayload & {
	userId: UserId,
	username: Username,
	name: Name
};
