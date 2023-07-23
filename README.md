# frog-routes


## API Design

### User

- create a new user
- delete an existing user given public_id or email
- list all the projects that connect to a user given public_id or email


### Project

- create a new project, a project can be created as guest or as logged-in user
    - the project without any user link will be deleted after 3 days
    - the project that is created under a user will be kept, and only deleted if inactive for 14 days

- a user could have maximal 2 projects
