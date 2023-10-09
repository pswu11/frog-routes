import { z } from "zod"

export const projectSchema = z.object({
  body: z.object({
    id: z.string().uuid(),
    name: z.string().min(3).max(30),
    user_id: z.string().uuid(),
    created_at: z.date(),
    last_active_at: z.date(),
    token: z.string(),
  }),
  pathParams: z.object({}),
  queryParams: z.object({}),
})

export const projectPost = z.object({
  body: projectSchema.shape.body.pick({ name: true }),
  pathParams: z.object({}),
  queryParams: z.object({}),
})

export const projectGet = z.object({
  body: z.object({}),
  pathParams: z.object({
    pid: projectSchema.shape.body.shape.id,
  }),
  queryParams: z.object({}),
})

export const projectDelete = projectGet