import { app, prisma } from "../index"
import { z } from "zod"
import bcrypt from "bcrypt"
import { Prisma } from "@prisma/client"
import { Request, Response } from "express"

export function UserModel() {
  const userPostModel = z.object({
    body: z.object({
      public_id: z.string().min(3).max(20),
      password: z.string().min(8).max(25),
      email: z.string().email().nullable(),
    }),
    pathParams: z.object({}),
    queryParams: z.object({}),
  })

  const userGetModel = z.object({
    body: z.union([
      z.object({
        public_id: z.string().min(3).max(20),
      }),
      z.object({
        email: z.string().email(),
      }),
    ]),
    pathParams: z.object({}),
    queryParams: z.object({}),
  })

  const userLoginModel = z.object({
    body: z.union([
      z.object({
        public_id: z.string(),
        password: z.string().max(25),
      }),
      z.object({
        email: z.string().email(),
        password: z.string().max(25),
      }),
    ]),
    pathParams: z.object({}),
    queryParams: z.object({}),
  })

  app.post("/users", async (req: Request, res: Response) => {
    try {
      const { body: user } = userPostModel.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })
      const { password, ...userWithoutPassword } = user
      const newUser = await prisma.user.create({
        data: {
          ...userWithoutPassword,
          password_hash: await bcrypt.hash(password, 10),
        },
      })
      res.json(newUser)
      return
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        if (error.code === "P2002") {
          res.status(422).send({ error, message: error.message })
          return
        }
      res.status(500).send(`Something unexpected went wrong: ${error}`)
    }
  })

  app.get("/users", async (req, res) => {
    try {
      const { body: userInfo } = userGetModel.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })
      console.log(userInfo)
      if ("public_id" in userInfo) {
        console.log(userInfo, "has public_id")
        const user = await prisma.user.findUnique({
          where: {
            public_id: userInfo.public_id,
          },
        })
        res.json(user)
        return
      } else if ("email" in userInfo) {
        const user = await prisma.user.findUnique({
          where: {
            email: userInfo.email,
          },
        })
        res.json(user)
        return
      }
    } catch (error) {
      res.send(error)
    }
  })

  app.post("/users/login", async (req: Request, res: Response) => {
    try {
      const { body: userLoginInfo } = userLoginModel.parse({
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
      })
      if ("public_id" in userLoginInfo) {
        // TODO: since i don't want to deal with GDPR just yet,
        // users won't matter.
        console.log(userLoginInfo.public_id)
        res.send("OKEY!")
      }
    } catch (error) {
      res.send(error)
    }
  })

  app.delete("/users/:userId", async (req: Request, res: Response) => {
    const { user_id: id } = req.params
    console.log(id)
    try {
      const response = await prisma.user.delete({
        where: {
          public_id: id,
        },
      })
      res.json(response)
    } catch (error) {
      res.send(error)
    }
  })
}
