# API Spec

## `/postings`

- `GET` `"/"` -> Returns all stored internship posting
- `PUT` `"/"` -> Add new postings to Database

## `/users`

- `POST` `"/{list: 'INTERN' | 'NEWGRAD'}"` -> Add new user to database
- `GET` `"/{list: 'INTERN' | 'NEWGRAD'}"` -> Read all users according to list parameter
- `PUT` `"/"` -> Update subscription preferences
- `DELETE` `"/"` -> Delete user from DB
