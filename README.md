# frog-routes

## Usage

### Create Project

```bash
POST {{api_url}}/projects HTTP/1.1
Content-Type: application/json

{
    "name": "frog-routes"
}
```

Response body of a new project:

```json
{
  "id": "uuid",
  "name": "string",
  "user_id": "uuid",
  "created_at": "timestamp",
  "last_active_at": "timestamp",
  "token": "hash"
}
```

### Add routes to your project

A route is where you mock your HTTP response, using combination of "path",
"verb", "content_type", and "response_body": 

```bash
POST http://localhost:8000/projects/{{pid}}/routes HTTP/1.1
Content-Type: application/json

{
    "path": "/users",
    "verb": "DELETE",
    "content_type": "applicaton/json",
    "response_body": "{\"firstName\": \"Pei\", \"lastName\": \"Wu\"}"
}
```

(to be continued)

## TODOS

### Project

- [x] create projects
- [x] view project details
- [x] delete project and all its routes
- [ ] add creation and last used date to project (delete old ones)

### Routes

A route here means a path (e.g. /users) + verb (e.g. GET).

- [x] register a route for the project
- [x] view routes of the project
- [x] delete route (and linked data) from the project

### Auth

- [ ] on project creation return bearer for later auth

### Others

- [ ] static readme website hosted on root path
- [ ] put resources and middlewares in separate files
- [ ] add dockerfile deployment
- [ ] add project ID UUID validation hook
- [ ] custom 404 omitting error title
- [ ] add proper logging
- [ ] normalize paths on route registration
- [ ] middleware that checks existence when pid given and 404's early
- [ ] add user-defined status code (optional)
- [ ] add user-defined content type (optional)
- [x] use zod for data validation
- [ ] abstract data validation using `withValidation``
- [ ] background job that deletes old projects
- [ ] CORS middleware
- [ ] update route endpoint
- [ ] move db to docker volume forwarded to repo dir for persistence
- [x] add route data size limit (5M?)
- [ ] swagger docs -> too much work
- [x] rate limit on all requests
- [ ] code documentation
- [ ] proper readme file
