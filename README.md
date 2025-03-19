# **Full-Stack Application with Docker**

This project is a full-stack application consisting of a **React frontend**, a **Node.js backend**, **MySQL** for the database, **Redis** for caching, and **Nginx** as a reverse proxy. Docker and Docker Compose are used to containerize and orchestrate the services.

## **Table of Contents**

- [**Full-Stack Application with Docker**](#full-stack-application-with-docker)
  - [**Table of Contents**](#table-of-contents)
  - [**Prerequisites**](#prerequisites)
  - [**Setup and Installation**](#setup-and-installation)
  - [**Running the Application**](#running-the-application)
    - [**1. Building and Starting Services**](#1-building-and-starting-services)
    - [**2. Restarting the Application**](#2-restarting-the-application)
    - [**3. Rebuilding Containers**](#3-rebuilding-containers)
  - [**Accessing the Application**](#accessing-the-application)
  - [**Directory Structure**](#directory-structure)
    - [**Important Files:**](#important-files)
  - [**Stopping the Application**](#stopping-the-application)
    - [**Accessing Specific Services**](#accessing-specific-services)
    - [**License**](#license)

## **Prerequisites**

Before running the application, ensure that you have the following installed:

- **Docker** (Install [Docker](https://www.docker.com/get-started) if not already installed)
- **Docker Compose** (Install [Docker Compose](https://docs.docker.com/compose/install/) if not already installed)

## **Setup and Installation**

1. Clone the repository to your local machine:

   ```bash
   git clone git@github.com:toewailin/fullstack-docker.git
   cd fullstack-docker
   ```

2. Ensure that Docker is installed and running by checking its version:

   ```bash
   docker --version
   docker-compose --version
   ```

3. Ensure that all the necessary files are available in your project directory:
   - `frontend/` - The React application code
   - `backend/` - The Node.js application code
   - `nginx/` - Nginx configuration for reverse proxy
   - `docker-compose.yml` - Docker Compose file for orchestrating services
   - `README.md` - This file!

## **Running the Application**

### **1. Building and Starting Services**

Use **Docker Compose** to build and start the containers for the frontend, backend, database, and Nginx reverse proxy:

```bash
docker compose up --build
```

This command will:
- Build the Docker images for the **frontend** (React), **backend** (Node.js), **Nginx** (reverse proxy), and the database.
- Start the containers for **MySQL**, **Redis**, **Node.js**, **React**, and **Nginx**.

### **2. Restarting the Application**

If you need to restart the application after making changes to the code or configuration, run the following:

```bash
docker compose restart
```

### **3. Rebuilding Containers**

If you make changes to the Dockerfiles or dependencies, you may need to rebuild the containers:

```bash
docker compose up --build
```

## **Accessing the Application**

Once the application is running, you can access it in your web browser at:

- **Frontend (React)**: `http://localhost:3000`
- **Backend (API)**: The backend will be accessible via the Nginx reverse proxy at `http://localhost/api/` (e.g., `http://localhost/api/login`).

## **Directory Structure**

Here’s the structure of the project:

```
my-app/
├── backend/               # Backend Node.js API
│   ├── config/
│   ├── routes/
│   ├── models/
│   ├── Dockerfile         # Dockerfile for Node.js backend
│   └── (other backend files)
├── frontend/              # Frontend React application
│   ├── public/
│   ├── src/
│   ├── Dockerfile         # Dockerfile for React frontend
│   └── (other frontend files)
├── nginx/                 # Nginx configuration for reverse proxy
│   ├── default.conf       # Nginx default configuration
│   └── Dockerfile         # Dockerfile for Nginx (optional if using custom config)
├── docker-compose.yml     # Docker Compose configuration file
└── README.md              # This README file
```

### **Important Files:**

- **`docker-compose.yml`**: Defines the services (frontend, backend, MySQL, Redis, Nginx) and their configurations.
- **`frontend/Dockerfile`**: Dockerfile for the React application (builds and serves the app using Nginx).
- **`backend/Dockerfile`**: Dockerfile for the Node.js backend API.
- **`nginx/default.conf`**: Nginx configuration for routing frontend and API requests.

## **Stopping the Application**

To stop the running containers, use the following command:

```bash
docker compose down
```

This will stop and remove the containers but leave the images and volumes intact. If you want to remove the volumes (e.g., database data), use:

```bash
docker compose down -v
```

This will stop and remove all containers, networks, and volumes.

---

### **Accessing Specific Services**

- **MySQL**: The MySQL container is available for access inside the Docker network. To access MySQL using a MySQL client, use the following credentials:
  - **Host**: `mysql`
  - **Username**: `root`
  - **Password**: `example`
  - **Database**: `admin_panel`

---

### **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This README file outlines the essential steps to set up and run your application using **Docker Compose**. If you encounter any issues or need more details, feel free to ask!
