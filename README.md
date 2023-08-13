# frog-routes


### Database Diagram

(add later)

### TODOS

#### Project

- [x] create projects
- [x] view project details
- [x] delete project and all its routes
- [ ] add creation and last used date to project (delete old ones)

#### Routes

A route here means a path (e.g. /users) + verb (e.g. GET).

- [x] register a route for the project
- [X] view routes of the project
- [x] delete route (and linked data) from the project

#### Auth

- [ ] on project creation return bearer for later auth

#### Others

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
- [ ] background job that deletes old projects
- [ ] CORS middleware
- [ ] update route endpoint
- [ ] move db to docker volume forwarded to repo dir for persistence
- [x] add route data size limit (5M?)
- [ ] swagger docs -> too much work
- [x] rate limit on all requests
- [ ] code documentation
- [ ] proper readme file