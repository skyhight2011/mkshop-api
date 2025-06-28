<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# MKShop API

A NestJS API with MongoDB integration using Mongoose.

## Features

- MongoDB connection with Mongoose
- User management with CRUD operations
- Environment-based configuration
- TypeScript support

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Yarn package manager

## Installation

```bash
# Install dependencies
yarn install

# Create environment file
cp .env.example .env
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mkshop

# Application Configuration
PORT=3000
NODE_ENV=development
```

### MongoDB Connection Options

1. **Local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/mkshop
   ```

2. **MongoDB with Authentication:**
   ```env
   MONGODB_URI=mongodb://username:password@localhost:27017/mkshop?authSource=admin
   ```

3. **MongoDB Atlas (Cloud):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mkshop?retryWrites=true&w=majority
   ```

## Running the Application

```bash
# Development mode
yarn start:dev

# Production mode
yarn start:prod

# Debug mode
yarn start:debug
```

## API Endpoints

### Users

- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Example User Object

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "age": 30,
  "isActive": true
}
```

## Project Structure

```
src/
├── config/
│   └── database.config.ts    # MongoDB configuration
├── schemas/
│   └── user.schema.ts        # User Mongoose schema
├── users/
│   ├── users.controller.ts   # User REST endpoints
│   ├── users.service.ts      # User business logic
│   └── users.module.ts       # User module
├── app.controller.ts         # Main app controller
├── app.service.ts           # Main app service
├── app.module.ts            # Root module
└── main.ts                  # Application entry point
```

## Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## Database Schema

### User Schema

- `email` (required, unique): User's email address
- `name` (required): User's full name
- `age` (optional): User's age
- `isActive` (default: true): User's active status
- `createdAt` (auto): Creation timestamp
- `updatedAt` (auto): Last update timestamp

## Development

The application uses:
- **NestJS** - Framework
- **Mongoose** - MongoDB ODM
- **TypeScript** - Programming language
- **Jest** - Testing framework

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

UNLICENSED
