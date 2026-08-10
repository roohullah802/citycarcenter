import { z } from "zod";

const issueSchema = z.object({
  description: z.string().min(5, "Description must be at least 5 characters"),
});

export { issueSchema };
