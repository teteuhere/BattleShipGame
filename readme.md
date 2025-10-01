# 🔥 Battleship: AI Edition 🔥

Welcome to Battleship: AI Edition! This is a classic game of Battleship with a modern twist, now supercharged with multiple game modes and strategic abilities. The project features a full-stack application with a Django backend that powers the game logic, a React frontend for an interactive user experience, and a powerful AI opponent driven by the Ollama framework. The entire application is containerized with Docker for easy setup and deployment.

## ✨ Features

* **Classic Battleship Gameplay**: The timeless naval strategy game you know and love.
* **Player vs. Player (PvP)**: Battle against a friend on the same machine.
* **Player vs. AI (PvA)**: Test your skills against a smart AI opponent.
* **"Hunter-Killer" AI**: The AI uses an advanced strategy. Once it scores a hit, it intelligently hunts in adjacent cells to sink the ship before searching elsewhere.
* **New Game Mode: Salvo**: A chaotic and fast-paced mode where players fire a number of shots equal to their number of surviving ships.
* **Power-Up System (Optional)**: Spice up your matches with three unique, one-time-use abilities:
    * **✈️ Scout Plane**: Reveals a random 2x2 area of the enemy's grid.
    * **🚀 Torpedo**: Fires a shot that travels across an entire row or column, hitting the first ship in its path.
    * **⚡ EMP Blast**: Disables your opponent's systems, forcing them to miss a turn.
* **Leaderboard**: A Hall of Fame that tracks and displays the top commanders by their total wins.
* **Containerized Environment**: Easy to set up and run on any machine with Docker using a single command.

-----

## 🛠️ Tech Stack

This project is built with a powerful and modern set of technologies:

* **Backend**: Python, Django, Django REST Framework
* **Frontend**: JavaScript, React, Vite, Tailwind CSS
* **Database**: MySQL
* **AI Engine**: Ollama (running the `gemma:2b` model)
* **Containerization**: Docker, Docker Compose

-----

## 🚀 Getting Started

Follow these simple instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have **Docker** and **Docker Compose** installed on your system.

### Running the Application with One Command

This project includes an automated script that handles the entire setup process for you, from building the containers to running the database migrations and starting the frontend server.

1.  **Clone the Repository**
    ```bash
    git clone <your-repository-url>
    cd BattleShipGame
    ```

2.  **Run the Start Script**
    Open your terminal, navigate to the project's root directory, and run the following command:

    ```bash
    ./start.sh
    ```
    This script will:
    * Stop any old running containers.
    * Build the new Docker images.
    * Start all services (Django, MySQL, Ollama).
    * Automatically download the required AI model.
    * Apply all necessary database migrations.
    * Install frontend dependencies and launch the Vite development server.

### 4. You're Ready to Play!

With the script running, open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`). Have fun!

---

### Manual Docker Commands (Optional)

If you prefer to manage the services manually:

* **To stop all services**:
    ```bash
    docker-compose down
    ```
* **To view the logs from the backend**:
    ```bash
    docker-compose logs -f web
    ```
