CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "quicklink" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "shortLink" varchar UNIQUE,
  "actualLink" varchar,
  "userId" UUID,
  "createdAt" timestamp DEFAULT (now()),
  "updatedAt" timestamp DEFAULT (now())
);

CREATE TABLE "user" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "firstName" varchar,
  "lastName" varchar,
  "authId" UUID NOT NULL,
  "createdAt" timestamp DEFAULT (now()),
  "updatedAt" timestamp DEFAULT (now())
);

CREATE TABLE "auth" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" varchar UNIQUE,
  "username" varchar UNIQUE,
  "password" varchar,
  "roleId" UUID NOT NULL,
  "createdAt" timestamp DEFAULT (now()),
  "updatedAt" timestamp DEFAULT (now())
);

CREATE TABLE "role" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" varchar UNIQUE,
  "description" varchar,
  "createdAt" timestamp DEFAULT (now()),
  "updatedAt" timestamp DEFAULT (now())
);

ALTER TABLE "quicklink" ADD FOREIGN KEY ("userId") REFERENCES "user" ("id");

ALTER TABLE "user" ADD FOREIGN KEY ("authId") REFERENCES "auth" ("id");

ALTER TABLE "auth" ADD FOREIGN KEY ("roleId") REFERENCES "role" ("id");

INSERT INTO "role" ("name", "description") VALUES ('User', 'User role');
