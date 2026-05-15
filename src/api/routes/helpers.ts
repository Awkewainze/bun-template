import type { DecodedJWT, EncodedJWT, ErrorResponseBody } from "@/types";
import { HttpStatus } from "@/utilities";
import { toValidationResponseBody } from "@/validations";
import { type Serve } from "bun";
import { CompactSign, compactVerify, generateSecret } from "jose";
import { ZodError, ZodType, type output } from "zod";


export function router<W, R extends string>(routes: Serve.Routes<W, R>) {
	return routes;
}

export function createErrorBody<T>(error: string | ZodError<T>): ErrorResponseBody {
	if (error instanceof ZodError) {
		return toValidationResponseBody(error);
	}

	return { error };
}

export const Ok = <T extends object>(body?: T) => Response.json(body);
export const Created = <T extends object>(body?: T) => Response.json(body, { status: HttpStatus.CREATED });
export const NoContent = () => new Response(null, { status: HttpStatus.NO_CONTENT });
export const BadRequest = <T extends ErrorResponseBody>(body: T) => Response.json(body, { status: HttpStatus.BAD_REQUEST });
export const BadValidation = <T>(error: string | ZodError<T>) => BadRequest(createErrorBody(error));
export const Unauthorized = () => Response.json({ error: "Unauthorized" }, { status: HttpStatus.UNAUTHORIZED });
/**
 * @deprecated Prefer using NotFound
 */
export const Forbidden = () => Response.json({ error: "Forbidden" }, { status: HttpStatus.FORBIDDEN });
export const NotFound = () => Response.json({ error: "Resource not found" }, { status: HttpStatus.NOT_FOUND });

export async function ensureAuthorized<T extends Bun.BunRequest>(req: T, authFunction: (token: DecodedJWT) => Promise<boolean>, next: (token: DecodedJWT) => Promise<Response>): Promise<Response> {
	const tokenWithBearer = req.headers.get("Authorization");

	if (!tokenWithBearer) {
		return Unauthorized();
	}

	const bearerRemoved = tokenWithBearer.replace("Bearer ", "") as EncodedJWT;

	try {
		const jwt = await verifyAndDecodeJWT(bearerRemoved);
		if (await authFunction(jwt)) {
			return next(jwt);
		}

		return NotFound();
	} catch (error) {
		console.error("error", error);
		return Unauthorized();
	}
}

export async function zParseOrBadRequest<TSchema extends ZodType>(schema: TSchema, data: unknown, overrideResponse?: Response): Promise<{ isValid: true, result: output<TSchema> } | { isValid: false, response: Response }> {
	const parseResult = await schema.safeParseAsync(data);
	if (parseResult.success) {
		return { isValid: true, result: parseResult.data };
	}

	return { isValid: false, response: BadValidation(parseResult.error) };
}

const jwtSecret = await generateSecret("HS256", { extractable: true });

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function encodeAndSignJWT(userToken: DecodedJWT): Promise<EncodedJWT> {
	const encoded = encoder.encode(JSON.stringify(userToken));
	return await new CompactSign(encoded).setProtectedHeader({ alg: "HS256" }).sign(jwtSecret) as EncodedJWT;
}

export async function verifyAndDecodeJWT(token: EncodedJWT): Promise<DecodedJWT> {
	const result = await compactVerify(token, jwtSecret);
	return JSON.parse(decoder.decode(result.payload)) as DecodedJWT;
}
