import { Request, Response } from "express"
import { Express } from "express"
import { routeGetPayload, routeGetSingle, routePost } from "./schema/route"
import { prisma } from "../server"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { projectGet } from "./schema/project"
import { Method } from "@prisma/client"

export function RouteModule(app: Express) {
  // create a new route
  app.post("/projects/:pid/routes", async (req: Request, res: Response) => {
    try {
      const { body: routeInfo, pathParams: params } = routePost.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })

      // validate JSON payload
      if (routeInfo.content_type === "application/json") {
        try {
          JSON.parse(routeInfo.payload)
        } catch (error) {
          res.status(400).send({ error: "Invalid JSON payload" })
          return
        }
      }

      const newRoute = await prisma.route.create({
        data: {
          path: routeInfo.path,
          verb: routeInfo.verb as Method,
          project_id: params.pid,
          content_type: !routeInfo.content_type ? "text/plain" : routeInfo.content_type,
          payload: routeInfo.payload,
        },
      })

      console.log(newRoute)
      res.status(201).json(newRoute)
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

  // user send a mock request to a route
  app.all("/projects/:pid/:path", async (req: Request, res: Response) => {
    try {
      const verb = req.method as Method
      const { pathParams: params } = routeGetPayload.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })

      const route = await prisma.route.findFirst({
        where: {
          project_id: params.pid,
          path: params.path,
          verb: verb,
        },
      })

      if (!route) {
        res.status(404).send({ path: params.path, message: "Route not found" })
        return
      }

      if (route.content_type === "application/json") {
        let payload = JSON.parse(route.payload)
        console.log(payload)
        res.status(200).send(payload)
      }

    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  })

}
