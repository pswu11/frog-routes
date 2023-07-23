import { app } from "../index"
import { Request, Response } from "express"
import { Prisma } from "@prisma/client"

export function ProjectModel() {
  app.post("projects/", async (req: Request, res: Response) => {
    const project = req.body
    try {
      console.log(project)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        if (error.code === "P2002") {
          res.status(422).send({ error, message: error.message })
        }
      res.status(500).send(`Something unexpected went wrong: ${error}`)
    }
    console.log(req)
    res.send("Fine")
  })
}