import request from "supertest"
import { app } from "../server"

const PROJECT_ROUTE = "/projects"
let PID = ""

beforeAll(() => {
  app.listen("8080");
});

describe("POST /projects", () => {
  test("should return a new project id", async () => {
    const res = await request(app).post(PROJECT_ROUTE).send({
      project_name: "test-project",
    })
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("id")
    PID = res.body.id
  })
})

describe("GET /projects/:pid", () => {
  test("should return a project object", async () => {
    console.log(`${PROJECT_ROUTE}/${PID}`)
    const res = await request(app).get(`${PROJECT_ROUTE}/${PID}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject(expect.objectContaining({id: PID}))
  })
})

describe("DELETE /projects/:pid", () => {
  test("should return a project object", async () => {
    console.log(`${PROJECT_ROUTE}/${PID}`)
    const res = await request(app).delete(`${PROJECT_ROUTE}/${PID}`)
    expect(res.statusCode).toBe(202)
    expect(res.body).toBe(`Deleted project: ${PID}`)
  })
})


