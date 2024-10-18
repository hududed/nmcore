import { z } from "zod";
 
export const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});
 
export type FormSchema = typeof formSchema;