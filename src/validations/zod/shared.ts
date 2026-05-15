import z from "zod";

export const zIsoToDateDefaultNow = z.iso.datetime()
	.transform(x => new Date(x))
	.default(() => new Date())
	.catch(() => new Date());
