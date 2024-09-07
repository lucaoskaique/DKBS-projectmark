# DKBS Projectmark

This project is a RESTful API for a Dynamic Knowledge Base System. The system manages interconnected topics and resources with version control, user roles, and permissions.


## Requirements

- Node.js
- npm or yarn
- PostgreSQL (or any other database you prefer)
- Docker

## Installation

To run this project, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/lucaoskaique/DKBS-projectmark.git
   cd DKBS-projectmark
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_USER=yourusername
   POSTGRES_PASSWORD=yourpassword
   POSTGRES_DB=yourdatabase
   JWT_SECRET=yourjwtsecret
   ```

3. Start the database:
   ```
   docker-compose up -d
   ```

4. Install dependencies:
   ```
   cd dkbs
   pnpm install
   ```

5. Set up and start the application:
   ```
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   pnpm dev
   ```

   The server will start on http://localhost:3000.

## Running Tests
Unit Tests
To run unit tests, use the following command:

```
pnpm test
```
## API Endpoints

### Topics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/topics` | Retrieve all topics |
| GET    | `/topics/:id` | Retrieve a specific topic by ID |
| POST   | `/topics` | Create a new topic |
| PUT    | `/topics/:id` | Update a topic by ID |
| DELETE | `/topics/:id` | Delete a topic by ID |

### Resources

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/resources` | Retrieve all resources |
| GET    | `/resources/:id` | Retrieve a specific resource by ID |
| POST   | `/resources` | Create a new resource |
| PUT    | `/resources/:id` | Update a resource by ID |
| DELETE | `/resources/:id` | Delete a resource by ID |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/users` | Retrieve all users |
| GET    | `/users/:id` | Retrieve a specific user by ID |
| POST   | `/users` | Create a new user |
| PUT    | `/users/:id` | Update a user by ID |
| DELETE | `/users/:id` | Delete a user by ID |

## Advanced Features
- Topic Version Control
Each update to a topic creates a new version, keeping the previous versions intact. You can retrieve a specific version of a topic using the GET /topics/:id/versions/:version endpoint.

- Recursive Topic Retrieval
Retrieve a topic and all its subtopics recursively using the GET /topics/:id/tree endpoint.

- Custom Algorithm
Find the shortest path between two topics in the topic hierarchy using the GET /topics/:id/shortest-path/:id endpoint.

You can use INSOMNIA or POSTMAN to test the API endpoints.
HERE IS THE INSOMNIA FILE TO TEST THE API ENDPOINTS: [INSOMNIA FILE](./DKBS-06-09.json)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
