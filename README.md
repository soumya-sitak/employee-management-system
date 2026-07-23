# Employee Management System

A full-stack employee management application with a Node.js REST API, PostgreSQL database, and Kubernetes deployment options (raw manifests and Helm).

## Features

- REST API for listing and creating employees
- PostgreSQL persistence
- Dockerized backend
- Kubernetes manifests for backend and Postgres
- Helm chart for parameterized deployments

## Tech Stack

| Layer        | Technology              |
| ------------ | ----------------------- |
| Backend      | Node.js, Express 5      |
| Database     | PostgreSQL 17           |
| Container    | Docker                  |
| Orchestration| Kubernetes, Helm        |

## Project Structure

```
employee-management-system/
├── backend/                 # Express REST API
│   ├── app.js
│   ├── db.js
│   ├── routes/
│   └── Dockerfile
├── database/                # Database scripts (optional)
├── frontend/                # UI (planned)
├── helm/employee-management # Helm chart
├── k8s/                     # Raw Kubernetes manifests
│   ├── backend/
│   ├── config/
│   └── postgres/
└── jenkins/                 # CI/CD (planned)
```

## Prerequisites

- Node.js 18+ (22 recommended for Docker)
- npm
- PostgreSQL 17 (local or container)
- Docker (optional, for container builds)
- kubectl and Helm 3 (for Kubernetes deployment)

## Local Development

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Create `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=employee_db
```

### 3. Set up the database

Connect to PostgreSQL and run:

```sql
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  department VARCHAR(255) NOT NULL
);
```

### 4. Start the server

```bash
npm start
```

The API runs at `http://localhost:5000`.

### Verify

```bash
curl http://localhost:5000/
curl http://localhost:5000/db-test
curl http://localhost:5000/employees
```

## API Endpoints

| Method | Endpoint      | Description              |
| ------ | ------------- | ------------------------ |
| GET    | `/`           | Health check message     |
| GET    | `/db-test`    | Test database connection |
| GET    | `/employees`  | List all employees       |
| POST   | `/employees`  | Create a new employee    |

### Create an employee

```bash
curl -X POST http://localhost:5000/employees \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "age": 30, "department": "Engineering"}'
```

**Request body:**

```json
{
  "name": "Jane Doe",
  "age": 30,
  "department": "Engineering"
}
```

**Response (201):**

```json
{
  "id": 1,
  "name": "Jane Doe",
  "age": 30,
  "department": "Engineering"
}
```

## Docker

Build and run the backend image from the `backend` directory:

```bash
cd backend
docker build -t employee-backend:latest .
docker run -p 5000:5000 --env-file .env employee-backend:latest
```

## Kubernetes Deployment

Deploy Postgres and the backend using the raw manifests in `k8s/`:

```bash
kubectl apply -f k8s/config/
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/backend/
```

Check status:

```bash
kubectl get pods
kubectl get svc
```

> **Note:** Update credentials in `k8s/config/*-secret.yaml` before deploying to production. Do not use default passwords in live environments.

## Helm Deployment

Install or upgrade the application with Helm:

```bash
helm upgrade --install employee-management ./helm/employee-management
```

Customize replicas, image tag, or Postgres storage in `helm/employee-management/values.yaml`:

```yaml
backend:
  replicaCount: 2
  image:
    repository: soumyasitak/employee-backend
    tag: v4

postgres:
  storage:
    size: 1Gi
  image:
    tag: "17"
```

## Environment Variables

| Variable      | Description           | Example            |
| ------------- | --------------------- | ------------------ |
| `DB_HOST`     | PostgreSQL host       | `localhost`        |
| `DB_PORT`     | PostgreSQL port       | `5432`             |
| `DB_USER`     | Database user         | `admin`            |
| `DB_PASSWORD` | Database password     | (set via secret)   |
| `DB_NAME`     | Database name         | `employee_db`      |

## Roadmap

- [ ] Frontend UI
- [ ] Database migration scripts in `database/`
- [ ] CI/CD pipeline (Jenkins or GitHub Actions)
- [ ] Ingress and TLS
- [ ] Unit and integration tests

## License

ISC
