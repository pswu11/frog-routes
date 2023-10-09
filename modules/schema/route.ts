import { z } from "zod"

export const routeSchema = z.object({
  body: z.object({
    id: z.string().uuid(),
    path: z.string().refine((val) => val.startsWith("/")),
    verb: z.string().regex(/^(GET|POST|PUT|DELETE)$/),
    project_id: z.string().uuid(),
    content_type: z
      .string()
      .regex(/^(application\/json|text\/html)$/)
      .toLowerCase()
      .optional(),
    payload: z.string(),
  }),
  pathParams: z.object({}),
  queryParams: z.object({}),
})

export const routePost = z.object({
  body: routeSchema.shape.body.pick({
    path: true,
    verb: true,
    payload: true,
  }),
  pathParams: z.object({
    pid: z.string().uuid(),
  }),
  queryParams: z.object({}),
})

export const routeGetSingle = z.object({
  body: z.object({}),
  pathParams: z.object({
    pid: z.string().uuid(),
    rid: z.string().uuid(),
  }),
  queryParams: z.object({}),
})
