import express from "express";
import { Request, Response } from "express"
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"

const app = express();
const prisma = new PrismaClient()
const PORT = process.env.PORT || 8000;

app.use(
  express.json({
    limit: '3mb',
  })
);

app.post('/users', async (req: Request, res: Response) => {
  const user = req.body
  try {
    const newUser =await prisma.user.create({
      data: {
        publicId: user.publicId,
        passwordHashAndSalt: await bcrypt.hash(user.password, 10),
      }
    })
    console.log(newUser)
    res.json(newUser)
    return
  } catch(error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      if (error.code === "P2002") {
        res.status(422).send({error, message: error.message})
      }
  };
})



app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});


