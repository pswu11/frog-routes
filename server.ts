import express from "express"
import { PrismaClient } from "@prisma/client"
import { UserModule } from "./modules/user"
import { ProjectModule } from "./modules/project"
import { RouteModule } from "./modules/routes"
import rateLimit from 'express-rate-limit'

const app = express()
const prisma = new PrismaClient()

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 50 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

app.use(
  express.json({
    limit: "3mb",
  })
)

app.get("/", (_, res) => {
  res.send("Hello World!")
})

UserModule(app)
ProjectModule(app)
RouteModule(app)

export { app }
export { prisma }