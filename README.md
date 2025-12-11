# Tickets

Ticktes is a high concurrenty scallable microservices.

⚠️ DISCLAIMER: This project is for educational porpuses only and should not be used in a production environment.

## Features

- distributed locking of seats using Redis
- JWT authentication
- RBAC

## Architecture
``` mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
## Tech stack

- NestJs
- Redis
- NATS
- Prisma ORM