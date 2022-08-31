# API Spec

## `/postings`

- `GET` `"/"` -> Returns all stored internship posting
- `POST` `"/"` -> Add new postings to Database

  - JSON Payload:

  ```
  [
  {
  	"company": "Meta",
  	"location": "Menlo Park",
  	"notes": "SWE Intern",
  	"isIntern": true,
  	"url": "https://careers.meta.com"
  },
  {
  	"company": "Google",
  	"location": "Mountain View, CA",
  	"notes": "SWE Intern",
  	"isIntern": true,
  	"url": "https://careers.google.com"
  }
  ]
  ```

## `/users`

- `POST` `"/"` -> Add new user to database

  - JSON Payload:

  ```
  "emailAddress": "example@gmail.com"
  "listPreferences": ["INTERN", "NEWGRAD"]
  ```

- `GET` `"/{API Key}/{list: 'intern' | 'newgrad'}"` -> Read all users according to list parameter

  - API Key -> Required
  - List -> Optional

- `DELETE` `"/"` -> Delete user from DB

  - JSON Payload:

  ```
  "userId": "UUID"
  "emailAddress": "example@gmail.com"
  ```
