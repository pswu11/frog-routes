import { Request, Response } from "express"
import { Express } from "express"
import { routeGetSingle, routePost } from "./schema/route"
import { prisma } from "../server"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { projectGet } from "./schema/project"

export function RouteModule(app: Express) {
  // create a new route
  app.post("/projects/:pid/routes", async (req: Request, res: Response) => {
    try {
      const { body: routeInfo, pathParams: params } = routePost.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })

      const newRoute = await prisma.route.create({
        data: {
          path: routeInfo.path,
          verb: routeInfo.verb,
          project_id: params.pid,
        },
      })

      const newStorage = await prisma.storage.create({
        data: {
          id: newRoute.id,
          payload: JSON.parse(routeInfo.response_body),
        },
      })

      console.log(newRoute, newStorage)
      res.status(201).json({ ...newRoute, payload: newStorage.payload })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        res.status(400).send({ error })
      }
      res.status(500).send(error)
    }
  })

  // list all routes
  app.get("/projects/:pid/routes", async (req: Request, res: Response) => {
    try {
      const { pathParams: params } = projectGet.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })

      const routes = await prisma.route.findMany({
        where: {
          project_id: params.pid,
        },
      })

      res.status(200).json(routes)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  // get a route by id
  app.get("/projects/:pid/routes/:rid", async (req: Request, res: Response) => {
    try {
      // TODO: validate project token with pid

      const { pathParams: params } = routeGetSingle.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })

      const route = await prisma.route.findUnique({
        where: {
          id: params.rid,
        },
        // include: {
        //   response_body: true,
        // }
      })

      res.status(200).json(route)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  // delete a route by id
  app.delete("/projects/:pid/routes/:rid", async (req: Request, res: Response) => {
    try {
      // TODO: validate project token with pid

      const { pathParams: params } = routeGetSingle.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })

      const route = await prisma.route.delete({
        where: {
          id: params.rid,
        }
      })
      res.status(200).json(route)
    } catch (error) {
      res.status(500).send(error)
    }
  })

}
