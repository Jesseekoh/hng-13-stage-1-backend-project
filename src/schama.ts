import { z } from "zod";

export const stringRequestSchema = z.object({
  value: z.string().min(1),
});
