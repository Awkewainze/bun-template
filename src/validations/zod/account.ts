import type { Name, Password, Username } from "@/types";
import z from "zod";

export const zName = z.string()
	.min(1)
	.max(80) as any as z.ZodType<Name>;

export const zUsername = z.string()
	.min(4)
	.max(80)
	.toLowerCase()
	.regex(/^[\w\-]+$/, "Username must only contain alphabetical characters, numbers, underscores (_), or hyphens (-)") as any as z.ZodType<Username>;

export const zPassword = z.string()
	.min(12)
	.max(128)
	.regex(/[a-z]/, "Password must have at least 1 lowercase alphabetical character")
	.regex(/[A-Z]/, "Password must have at least 1 uppercase alphabetical character")
	.regex(/\d/, "Password must have at least 1 number")
	.regex(/[\W_]/, "Password must have at least 1 special character") as any as z.ZodType<Password>;

export const zLogin = z.object({
	username: zUsername,
	password: zPassword
});

export const zAccount = zLogin.extend({
	name: zName
});
