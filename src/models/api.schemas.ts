import { z } from "zod";

export const ApiUserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.string().url(),
});

export const SupportSchema = z.object({
  url: z.string().url(),
  text: z.string(),
});

export const UsersListResponseSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  total: z.number(),
  total_pages: z.number(),
  data: z.array(ApiUserSchema),
  support: SupportSchema,
});

export const SingleUserResponseSchema = z.object({
  data: ApiUserSchema,
  support: SupportSchema,
});

export const CreateUserResponseSchema = z.object({
  name: z.string(),
  job: z.string(),
  id: z.string(),
  createdAt: z.string(),
});
