import request from "supertest"
import { app } from "../server"
import { randomUUID } from "crypto"

const PROJECT_ROUTE = "/projects"
let PID = ""

describe("POST /projects", () => {
  test("should return a new project id", async () => {
    const res = await request(app).post(PROJECT_ROUTE).send({
      project_name: "test-project",
    })
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("id")
    PID = res.body.id
  })

  test("should return a Zod error when project name has less than 3 charactor", async () => {
    const res = await request(app).post(PROJECT_ROUTE).send({
      project_name: "",
    })
    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty("issues")
    expect(res.body.issues).toBeInstanceOf(Array)
    expect(res.body.issues[0]).toHaveProperty("code")
  })
})

describe("GET /projects/:pid", () => {
  test("should return a project object", async () => {
    console.log(`${PROJECT_ROUTE}/${PID}`)
    const res = await request(app).get(`${PROJECT_ROUTE}/${PID}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject(expect.objectContaining({id: PID}))
  })

  test("should return an error when id doesn't exist", async () => {
    const randomPID = randomUUID()
    console.log(randomPID)
    const res = await request(app).get(`${PROJECT_ROUTE}/${randomPID}`)
    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe(`Project ID not found`)
  })
})

describe("DELETE /projects/:pid", () => {
  test("should return a project object", async () => {
    console.log(`${PROJECT_ROUTE}/${PID}`)
    const res = await request(app).delete(`${PROJECT_ROUTE}/${PID}`)
    expect(res.statusCode).toBe(204)
    expect(res.body).toBe(`Deleted project: ${PID}`)
  })
})