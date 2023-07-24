# frog-routes


### Database Diagram

(add later)

### TODOS

#### Project

- [x] create projects
- [x] view project details
- [ ] delete project and all its routes
- [ ] add creation and last used date to project (delete old ones)

#### Routes

A route here means a path (e.g. /users) + verb (e.g. GET).

- [ ] register a route for the project
- [ ] view routes of the project
- [ ] delete route from the project

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
- [ ] make general validation functions and move to sep. file (leading slash, field present)
- [ ] background job that deletes old projects
- [ ] CORS middleware
- [ ] update route endpoint
- [ ] move db to docker volume forwarded to repo dir for persistence
- [ ] add route data size limit (5M?)
- [ ] Python API client
- [ ] swagger docs -> too much work
- [ ] rate limit on state-changing endpoints
- [ ] code documentation
- [ ] proper readme file