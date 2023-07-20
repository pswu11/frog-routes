import express from "express";
import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"

const app = express();
const prisma = new PrismaClient()
const PORT = process.env.PORT || 8000;

const dummyUser = {
  "publicId": "lethalspoons",
  "password": "youCant%know#It"
}

app.use(
  express.json({
    limit: '3mb',
  })
);

app.post('/users', async (req: Request, res: Response) => {
  const user = dummyUser
  console.log(req)
  if (user.password) {
    const newUser = prisma.user.create({
      data: {
        publicId: user.publicId,
        passwordHashAndSalt: await bcrypt.hash(user.password, 10),
      }
    })
    res.json(newUser)
    return
  }

  res.status(500)
})



app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});


