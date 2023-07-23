import { app, prisma } from "../index"
import { Request, Response } from "express"
import { createHash } from "crypto"
import { z } from "zod"
import { Prisma } from "@prisma/client"

export function ProjectModel() {
  const projectPostModel = z.object({
    body: z.object({
      project_name: z.string().min(3).max(20),
    }),
    pathParams: z.object({}),
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
        .update(projectInfo.project_name)
        .digest("hex")
      console.log(token, projectInfo.project_name)
      const newProject = await prisma.project.create({
        data: {
          project_name: projectInfo.project_name,
          token,
        },
      })
      res.json(newProject)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(typeof error)
        if (error.code === "P2002") {
          res.status(422).send({ error, message: error.message })
          return
        }
      }
      res.status(500).send(`Something unexpected went wrong: ${error}`)
    }
  })
}
