import { z } from "zod";

const issueSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export { issueSchema };
