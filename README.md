# Project Manager API

A REST API for managing teams and projects, built with Express and
MongoDB. It was one of my first Node.js backends.

## What it has

- **Auth:** register and log in with a hashed password (bcrypt) and a JWT
- **Users:** profile, avatar upload, skills, change password
- **Projects:** create, edit, view and delete your projects
- **Teams:** create a team, list your teams, invite users to a team
- Request checks with Joi, file uploads with Multer, Helmet for
  safer headers

All routes are under `/api`, and versioned (`v1`) in the code.

## Running it

You need Node.js and MongoDB.

```
npm install
npm run start:dev
```

Set these in a `.env` file: `PORT`, `APP_ROOT`, `APP_NAME`, `DB_URL`,
`JWT_SECRET_KEY`.

Tests:

```
npm test
```

## Stack

Node.js, Express, MongoDB, Mongoose, JWT, Joi, Multer, Jest.
