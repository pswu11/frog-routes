import express from "express"
import { PrismaClient } from "@prisma/client"
import { UserModel } from "./modules/user"

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 8000

app.use(
  express.json({
    limit: "3mb",
  })
)

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

export { app }
export { prisma }

UserModel()

module.exports = app
