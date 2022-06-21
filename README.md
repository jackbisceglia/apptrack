# internship-tracker

## Setup
### Go API `./sf`
- Make sure to have Go installed: [Golang Website](https://go.dev/learn/) (Version 1.16+)
- Navigate to `sf` directory: `cd sf`
- Put .env file in here (be sure to be in `/sf`) (*.env file posted in slack*)
- Run `go install github.com/cosmtrek/air@latest` to install [air](https://github.com/cosmtrek/air) (Go dev. server)
- Run `go mody tidy`
- Run `air` to spin up development server
  - Note: if this doesn't work, there are 2 options:
   - Look up error on Stack Overflow to try to fix so that dev server can run
   - Just run `go run main.go`, which will execute and run our Go server, but doesn't have hot reload. If you're not working on the API, this should be sufficient since hot reload won't be very important

### Frontend `/react-ts'
- Have Yarn installed
- Run `yarn install` to install dependencies
