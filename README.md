# internship-tracker
 
**Directory Structure (city: service)**
- `sf/` &rarr; Golang REST API
- `montreal/` &rarr; AWS Lambda
- `tokyo/` &rarr; React/Typescript Web App 
- `istanbul` &rarr; Database Read Script (JS)

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
- Server should be running at https://localhost:8080/

### Frontend `./tokyo`
- Navigate to `tokyo` directory: `cd tokyo`
- Run `npm install` to install dependencies
- Get the following extensions:
  - TailwindCSS Intellisense 
  - PostCSS Language Support
  - (TypeScript support too maybe?)
- Run `npm run dev` to boot dev server
- App should be running at https://localhost:3000

### DB Scripts `./istanbul`
- Navigate to `/istanbul` `cd istanbul`
- Copy `.env` file from `/sf` and paste into `/istanbul`
- Run `npm install`
- Run `node main.js -h` to see the query options
