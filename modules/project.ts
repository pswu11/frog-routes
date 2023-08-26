import { prisma } from "../server"
import { Request, Response } from "express"
import { createHash } from "crypto"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import { Express } from "express"

export function ProjectModule(app: Express) {
  const projectPostModel = z.object({
    body: z.object({
      project_name: z.string().min(3).max(20),
    }),
    pathParams: z.object({}),
    queryParams: z.object({}),
  })

  const projectGetDeleteModel = z.object({
    body: z.object({}),
    pathParams: z.object({ pid: z.string().uuid() }),
    queryParams: z.object({}),
  })

  app.post("/projects", async (req: Request, res: Response) => {
    try {
      const { body: projectInfo } = projectPostModel.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })
      const token: string = createHash("sha256")
        .update(`projectInfo.project_name${Date.now()}`)
        .digest("hex")
      console.log(token, projectInfo.project_name)
      const newProject = await prisma.project.create({
        data: {
          project_name: projectInfo.project_name,
          token,
        },
      })
      res.status(201).json({ id: newProject.id, token: newProject.token })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(typeof error)
        if (error.code === "P2002") {
          res.status(422).send({ error })
          return
        }
      }

      if (error instanceof z.ZodError) {
        res.status(400).send(error)
        return
      }

      res.status(500).send(`Something unexpected went wrong: ${error}`)
    }
  })

  app.get("/projects/:pid", async (req: Request, res: Response) => {
    try {
      const { pathParams } = projectGetDeleteModel.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })
      const pid = pathParams.pid
      const projectInfo = await prisma.project.findUniqueOrThrow({
        where: {
          id: pid,
        },
      })
      res.status(200).json(projectInfo)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).send({ message: "Project ID not found"})
          return
        }
        res.status(500).send({ "Prisma Error": error.message })
        return
      }
      res.status(500).send(error)
    }
  })

  app.delete("/projects/:pid", async (req: Request, res: Response) => {
    try {
      const { pathParams } = projectGetDeleteModel.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })
      const pid = pathParams.pid
      const projectInfo = await prisma.project.delete({
        where: {
          id: pid,
        },
      })
      res.status(204).json(`Deleted project: ${projectInfo.id}`)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return res.status(400).send(error)
        }
        return res.status(400).send({ "Prisma Error": error.message })
      }
      res.status(500).send("Unexpected error happened.")
    }
  })
}
