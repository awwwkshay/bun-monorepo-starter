import type { ZodType } from "zod";
import z from "zod";

export const createApiResponseSchema = <TData extends ZodType,>(dataSchema: TData) => z.object({
    message: z.string(),
    data: dataSchema.nullish().default(null),
})
