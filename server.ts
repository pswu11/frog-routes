import express from "express"
import { PrismaClient } from "@prisma/client"
import { UserModule } from "./modules/user"
import { ProjectModule } from "./modules/project"
import { RouteModule } from "./modules/routes"

const app = express()
const prisma = new PrismaClient()

app.use(
  express.json({
    limit: "3mb",
  })
)

UserModule(app)
ProjectModule(app)
RouteModule(app)

export { app }
export { prisma }