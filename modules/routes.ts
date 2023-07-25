import { app, prisma } from "../index"
import { Request, Response } from "express"
import { ZodError, z } from "zod"

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

  const getAllRoutesModel = z.object({
    body: z.object({}),
    pathParams: z.object({
      pid: z.string().uuid(),
    }),
    queryParams: z.object({}),
  })

  const routeDeleteModel = z.object({
    body: z.object({}),
    pathParams: z.object({
      pid: z.string().uuid(),
      routeId: z.string().uuid()
    }),
    queryParams: z.object({}),
  })

  // create a new route
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
      if (error instanceof ZodError) {
        res.json({title: "Invalid data in Zod", message: error.message})
      }
      res.send(`Something unexpected went wrong: ${error}`)
    }
  })

  // list all routes of a project
  app.get("/projects/:pid/routes", async (req: Request, res: Response) => {
    try {
      const { pathParams } = getAllRoutesModel.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query
      })
      const projectId = pathParams.pid
      const routes = await prisma.route.findMany({
        where: {
          project_id: projectId
        }
      })
      console.table(routes)
      res.json(routes)
    } catch (error) {
      res.send(`Something unexpected went wrong: ${error}`)
    }
  })

  app.delete("/projects/:pid/routes/:routeId", async (req: Request, res: Response) => {
    try {
      const { pathParams: routeInfo } = routeDeleteModel.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.params
      })

      const deletedStorage = await prisma.storage.delete({
        where: {
          route_id: routeInfo.routeId
        }
      })

      const deletedRoute = await prisma.route.delete({
        where: {
          id: routeInfo.routeId
        }
      })

      res.json({deletedStorage, deletedRoute})

    } catch (error) {
      console.log(error)
      res.send(error)
    }
  })

}
