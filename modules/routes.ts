import { Storage } from "@prisma/client"
import { app, prisma } from "../index"
import { Request, Response } from "express"
import { z } from "zod"

export function RouteModule() {
  const routePostModel = z.object({
    body: z.object({
      path: z.string().startsWith("/").regex(/[a-zA-Z0-9\/]/).min(3).max(30),
      verb: z.string().toUpperCase().optional(),
      payload: z.string()
    }),
    pathParams: z.object({
      pid: z.string().uuid()
    }),
    queryParams: z.object({})
  })

  app.post("/projects/:pid", async (req: Request, res: Response) => {
    try {
      const { body: routeInfo, pathParams } = routePostModel.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query
      })
      const newRoute = await prisma.route.create({
        data: {
          project_id: pathParams.pid,
          path: routeInfo.path,
          verb: routeInfo.verb ?? "GET"
        }
      })
      const newPayload = await prisma.storage.create({
        data: {
          id: pathParams.pid,
          path_id: newRoute.id,
          data: routeInfo.payload
        } as Storage
      })
      res.json(newRoute)
    } catch (error) {
      res.send(`Something unexpected went wrong: ${error}`)
    }
  })
}
