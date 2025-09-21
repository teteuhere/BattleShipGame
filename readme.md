# 🔥 Battleship: AI Edition 🔥

Welcome to Battleship: AI Edition\! This is a classic game of Battleship with a modern twist. The project features a full-stack application with a Django backend that powers the game logic, a React frontend for an interactive user experience, and a powerful AI opponent driven by the Deepseek model running through Ollama. The entire application is containerized with Docker for easy setup and deployment.

## ✨ Features

  * **Classic Battleship Gameplay**: A fully implemented game of Battleship.
  * **AI Opponent**: Play against a smart AI powered by the Deepseek language model.
  * **Modern Tech Stack**: Built with Django, React, and Docker for a robust and scalable application.
  * **RESTful API**: A clean and well-structured API to manage the game state.
  * **Containerized Environment**: Easy to set up and run on any machine with Docker.

-----

## 🛠️ Tech Stack

This project is built with a powerful and modern set of technologies:

  * **Backend**: Python, Django, Django REST Framework
  * **Frontend**: JavaScript, React, Vite
  * **Database**: MySQL
  * **AI Engine**: Ollama with the Deepseek model
  * **Containerization**: Docker, Docker Compose

-----

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following software installed on your system:

  * **Docker** and **Docker Compose**: To run the containerized application.
  * **Node.js** and **npm**: To manage the frontend dependencies and run the development server.

### 1\. Clone the Repository

First, clone this repository to your local machine.

```bash
git clone <your-repository-url>
cd BattleShipGame
```

### 2\. Initial Setup (First Time Only)

The first time you run the project, you need to build the Docker images and set up the database.

```bash
# Build the images and start the containers in the background
docker-compose up --build -d

# Apply the database migrations to create the necessary tables
docker-compose exec web python manage.py migrate
```

### 3\. Running the Application

Once the initial setup is complete, you can use these commands to manage the application.

#### **Starting the Docker Services**
To build the services, run:

```bash
docker-compose up -d --build
```

To start all the backend services (Django, MySQL, Ollama) after they've been stopped, run:


```bash
docker-compose start
```

To start all the docker, run:

```bash
docker-compose exec web bash
```

#### **Starting the Frontend**

The frontend runs in a separate development server. Open a **new terminal** for this.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (only needed once)
npm install

# Start the frontend development server
npm run dev -- --host
```

#### **Stopping the Docker Services**

To stop all the running Docker containers, use:

```bash
docker-compose stop
```

#### **Viewing Logs**

If you need to see the output from your backend services (for debugging, etc.), you can run:

```bash
docker-compose logs -f
```

### 4\. You're Ready to Play\!

With both the Docker services and the frontend server running, open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`). Have fun\!