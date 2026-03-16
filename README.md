# Containerized Application with Docker Networking

## Project Overview

This project demonstrates how to containerize a backend application and database using Docker.
The backend service is built with Node.js and connects to a PostgreSQL database.
Both services run inside containers and communicate using Docker networking.

The project also demonstrates:

* Containerization of applications
* Multi-container architecture
* Docker networking
* Service communication using Docker Compose

---

# Technologies Used

* Docker
* Docker Compose
* Node.js
* PostgreSQL
* REST API

---

# Project Architecture

User → Backend Container → PostgreSQL Container

The backend container handles API requests and communicates with the database container to store and retrieve data.

---

# Project Directory Structure

containerized-app
│
├── backend
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── db
│   └── Dockerfile
│   └── init.sql
│
├── docker-compose.yml
└── README.md

---

# Prerequisites

Before running the project ensure the following tools are installed:

Docker
Docker Compose
Git

Check installation:

docker --version
docker compose version

---

# Step 1: Clone the Repository

Clone the project repository and navigate to the project folder.

git clone <repository-url>
cd containerized-app

---

# Step 2: Create Custom Docker Network

Create a macvlan network so containers get their own IP address.

docker network create -d macvlan 
--subnet=192.168.200.0/24 
--gateway=192.168.200.1 
-o parent=eth0 
macvlan_net

Verify the network:

docker network ls

Expected output should include:

macvlan_net

---

# Step 3: Build Docker Images

Build the images for backend and database services.

docker compose build

---

# Step 4: Start Containers

Start the containers in detached mode.

docker compose up -d

Verify containers are running:

docker ps

Example output:

backend
postgresdb

---

# Step 5: Check Container Logs

To verify that the backend server started correctly:

docker logs backend

Expected output:

Server running on port 3000

---

# Step 6: Inspect Container Network

To check container IP address and network details:

docker inspect backend

Look for the NetworkSettings section:

IPAddress: 192.168.200.10

---

# Step 7: Test the Backend API

Test using curl command:

curl http://localhost:3000

Or open in browser:

http://localhost:3000

---

# Step 8: Access Container Shell

To open the backend container terminal:

docker exec -it backend sh

Inside the container you can test:

curl http://localhost:3000

Exit container:

exit

---

# Step 9: View Docker Networks

docker network ls

To inspect network configuration:

docker network inspect macvlan_net

---

# Step 10: Stop Containers

To stop and remove containers:

docker compose down

---

# Useful Docker Commands

List running containers:

docker ps

List all containers:

docker ps -a

View logs:

docker logs backend

Restart containers:

docker compose restart

Remove containers and network:

docker compose down

---

# Networking Concept Used

This project uses Docker macvlan networking.

Features:

* Containers get their own MAC address
* Containers behave like separate devices on the network
* Each container receives its own IP address

Example:

Backend Container IP : 192.168.200.10
Database Container IP : 192.168.200.11

---

# Conclusion

This project demonstrates how Docker can be used to containerize applications and manage multiple services using Docker Compose. It also shows how custom Docker networks can be used to allow communication between containers while maintaining isolation.
