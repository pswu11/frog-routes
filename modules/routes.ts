import { app, prisma } from "../index"
import { Request, Response } from "express"
import { z } from "zod"

export function RouteModule() {
  const routePostModel = z.object({
    body: z.any(),
    pathParams: z.object({
      pid: z.string().uuid(),
    }),
    queryParams: z.object({
      path: z.string().startsWith("/").min(3).max(30),
      verb: z.string().toUpperCase().optional(),
    }),
  })

  app.post("/projects/:pid/routes", async (req: Request, res: Response) => {
    try {
      const {
        body: payloadData,
        pathParams,
        queryParams,
      } = routePostModel.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })
      console.log(payloadData, pathParams, queryParams)
      const newRoute = await prisma.route.create({
        data: {
          project_id: pathParams.pid,
          path: queryParams.path,
          verb: queryParams.verb ?? "GET",
        },
      })
      const newPayload = await prisma.storage.create({
        data: {
          route_id: newRoute.id,
          path_id: newRoute.id,
          payload: payloadData,
        },
      })
      res.json({
        ...newRoute,
        payload: newPayload.payload,
      })
    } catch (error) {
      res.send(`Something unexpected went wrong: ${error}`)
    }
  })
}
