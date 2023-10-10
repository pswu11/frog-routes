import { prisma } from "../server"
import { Request, Response } from "express"
import { createHash } from "crypto"
import { Prisma } from "@prisma/client"
import { Express } from "express"
import { projectDelete, projectGet, projectPost } from "./schema/project"

export function ProjectModule(app: Express) {
  // create a new project
  app.post("/projects", async (req: Request, res: Response) => {
    try {
      const { body: projectInfo } = projectPost.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })

      const token: string = createHash("sha256")
        .update(`${projectInfo.name}${Date.now()}`)
        .digest("hex")

      const newProject = await prisma.project.create({
        data: {
          name: projectInfo.name,
          token,
        },
      })
      res.status(201).json(newProject)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(typeof error)
        if (error.code === "P2002") {
          res.status(422).send({ error })
          return
        }
      }
    }
  })

  // get a project by id
  app.get("/projects/:pid", async (req: Request, res: Response) => {
    try {
      const { pathParams: params } = projectGet.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })
      const projectInfo = await prisma.project.findUniqueOrThrow({
        where: {
          id: params.pid,
        },
      })
      res.status(200).json(projectInfo)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }})
  
  // get all projects
  app.get("/projects", async (req: Request, res: Response) => {
    try {
      console.log(req.header)
      const projects = await prisma.project.findMany()
      res.status(200).json(projects)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  })

  // delete a project by id
  app.delete("/projects/:pid", async (req: Request, res: Response) => {
      try {
        const { pathParams: params } = projectDelete.parse({
          body: req.body,
          pathParams: req.params,
          queryParams: req.query,
        })
        const projectDeleted = await prisma.project.delete({
          where: {
            id: params.pid,
          }
        })
        console.log("project delete:", projectDeleted)
        res.status(204).json(projectDeleted)
      } catch (error) {
        console.log(error)
        res.status(500).send(error)
      }

  })
}