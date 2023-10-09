import request from "supertest"
import { app } from "../../server"

const PID = "82c1bce1-51a3-46b3-a66b-5802f141ccf4"
let RouteID = ""

describe("POST /projects/PID", () => {
  const PATH = "/all-users"
  const VERB = "GET"
  const PAYLOAD = [
    {
      userName: "test-user",
      email: "abc@example.com",
    },
    {
      userName: "test-admin",
      email: "admin@example.com",
    },
  ]
  const PROJECT_PATH_ROUTE = `/projects/${PID}/routes?path=${PATH}&verb=${VERB}`
  test("should return a route project", async () => {
    const res = await request(app).post(PROJECT_PATH_ROUTE).send(PAYLOAD)
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeInstanceOf(Object)
    expect(res.body).toHaveProperty("payload")
    expect(res.body.route.path).toBe(PATH)
    expect(res.body.route.verb).toBe(VERB)
    expect(res.body.payload).toMatchObject(PAYLOAD)
    RouteID = res.body.route.id
    console.log(RouteID)
  })
})
