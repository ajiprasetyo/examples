# TypeScript Express GraphQL API

A Monolithic Modular Backend API using TypeScript, Express.js, and GraphQL (Apollo Server Express) that serves 2 types of users: admin and user.

## Technology Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **GraphQL**: Apollo Server Express
- **Database**: MongoDB (via mongoose)
- **Authentication**: JWT + bcrypt
- **Role-based access**: user & admin
- **Input validation**: class-validator
- **Config**: dotenv
- **Logging**: pino
- **Tools**: ts-node-dev, eslint, prettier, concurrently

## Features

- **User Features**:
  - Register and login
  - View available vegetable products
  - View product details
  - Create orders
  - View order history

- **Admin Features**:
  - Login with admin credentials
  - Manage products (CRUD operations)
  - View all orders
  - View all users

## Project Structure

```
src/
├── index.ts                 // App entry point
├── server.ts                // Express + Apollo setup
├── config/
│   ├── env.ts
│   └── database.ts
├── middleware/
│   ├── auth.ts              // JWT verification
│   └── errorHandler.ts      // Global error handling
├── schema/
│   └── modules/
│       ├── user/            // Module for buyers
│       ├── admin/           // Module for admin
│       └── shared/          // Shared models & logic
├── utils/
│   ├── logger.ts
│   └── seed.ts
├── constants/
└── types/
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ts-express-graphql-api.git
   cd ts-express-graphql-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration.

### Running the Application

#### Development Mode

```bash
npm run dev
```

This will start the server with hot-reloading using ts-node-dev.

#### Production Mode

```bash
npm run build
npm start
```

### Docker

To run the application using Docker:

```bash
# Build the Docker image
npm run docker:build

# Run the Docker container
npm run docker:run
```

## API Endpoints

The GraphQL API is available at:

```
http://localhost:4000/graphql
```

### GraphQL Operations

#### Authentication

- **Register User**:
  ```graphql
  mutation {
    registerUser(input: {
      name: "John Doe",
      email: "john@example.com",
      password: "Password@123"
    }) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
  ```

- **Login User**:
  ```graphql
  mutation {
    loginUser(input: {
      email: "john@example.com",
      password: "Password@123"
    }) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
  ```

- **Login Admin**:
  ```graphql
  mutation {
    loginAdmin(input: {
      email: "admin@example.com",
      password: "Admin@123"
    }) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
  ```

#### User Operations

- **Get Available Products**:
  ```graphql
  query {
    getAvailableProducts {
      id
      name
      description
      price
      stock
      imageUrl
    }
  }
  ```

- **Get Product by ID**:
  ```graphql
  query {
    getProductById(id: "productId") {
      id
      name
      description
      price
      stock
      imageUrl
    }
  }
  ```

- **Create Order**:
  ```graphql
  mutation {
    createOrder(input: {
      productIds: ["productId1", "productId2"],
      shippingAddress: "123 Main St, City, Country"
    }) {
      id
      totalAmount
      status
      products {
        id
        name
      }
    }
  }
  ```

- **Get My Orders**:
  ```graphql
  query {
    getMyOrders {
      id
      totalAmount
      status
      products {
        id
        name
      }
      createdAt
    }
  }
  ```

#### Admin Operations

- **Get All Products**:
  ```graphql
  query {
    getAllProducts {
      id
      name
      description
      price
      stock
      imageUrl
    }
  }
  ```

- **Create Product**:
  ```graphql
  mutation {
    createProduct(input: {
      name: "Organic Carrot",
      description: "Fresh organic carrots",
      price: 2.99,
      stock: 100,
      imageUrl: "https://example.com/carrot.jpg"
    }) {
      id
      name
      description
      price
      stock
      imageUrl
    }
  }
  ```

- **Update Product**:
  ```graphql
  mutation {
    updateProduct(
      id: "productId",
      input: {
        name: "Organic Carrot",
        description: "Fresh organic carrots",
        price: 3.49,
        stock: 150,
        imageUrl: "https://example.com/carrot.jpg"
      }
    ) {
      id
      name
      description
      price
      stock
      imageUrl
    }
  }
  ```

- **Delete Product**:
  ```graphql
  mutation {
    deleteProduct(id: "productId")
  }
  ```

- **Get All Orders**:
  ```graphql
  query {
    getAllOrders {
      id
      user {
        id
        name
        email
      }
      products {
        id
        name
      }
      totalAmount
      status
      createdAt
    }
  }
  ```

- **Get All Users**:
  ```graphql
  query {
    getAllUsers {
      id
      name
      email
      role
      createdAt
    }
  }
  ```

## Authentication

The API uses JWT for authentication. To access protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Error Handling

The API provides detailed error messages for validation errors and other issues. In production mode, internal server errors are masked for security reasons.

## License

This project is licensed under the ISC License.

