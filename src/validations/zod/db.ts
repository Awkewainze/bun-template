import z from "zod";

export const zId = z.uuidv7();

export const zCursor = zId
	.optional()
	.catch(undefined)
	.transform(x => (x === "" ? undefined : x));

export const zTake = z.coerce.number()
	.positive()
	.max(100)
	.default(20)
	.catch(20);
