# 🔥 Battleship: AI Edition 🔥

Welcome to Battleship: AI Edition! This is a classic game of Battleship with a modern twist, now supercharged with multiple game modes and strategic abilities. The project features a full-stack application with a Django backend that powers the game logic, a React frontend for an interactive user experience, and a powerful AI opponent driven by the Ollama framework. The entire application is containerized with Docker for easy setup and deployment.

## ✨ Features

* **Multiplayer & Single Player Modes**:
    * **Online Multiplayer**: Create a game lobby and share a unique code to play with a friend on a different machine.
    * **Local PvP**: Battle against a friend on the same machine with turn-switch screens for privacy.
    * **Player vs. AI**: Test your skills against a smart AI opponent.

* **Dynamic & Responsive Gameplay**:
    * **Responsive Board**: The game automatically adapts its layout, offering a classic **10x10** board on mobile devices and an epic **32x8** widescreen board on desktops.
    * **"Commit-to-Play" Online**: To ensure fair play, players in an online match cannot simply leave. The back button is disabled, and closing the browser tab will automatically trigger a surrender.

* **Engaging Game Modes**:
    * **Classic Mode**: The timeless naval strategy game you know and love. One shot per turn.
    * **Salvo Mode**: A chaotic and fast-paced mode where players fire a number of shots equal to their number of surviving ships each turn.

* **Advanced AI & Systems**:
    * **"Hunter-Killer" AI**: The AI uses an advanced strategy. Once it scores a hit, it intelligently hunts in adjacent cells to sink the ship before searching elsewhere.
    * **In-Game AI Assistant**: A floating chat widget allows you to chat with a helpful AI assistant about the game or anything else, at any time.

* **Strategic Power-Ups**:
    * Spice up your matches with three unique, one-time-use abilities in PvP modes:
        * **✈️ Scout Plane**: Reveals a random 2x2 area of the enemy's grid.
        * **🚀 Torpedo**: Fires a shot that travels across an entire row or column, hitting the first ship in its path.
        * **⚡ EMP Blast**: Disables your opponent's systems, forcing them to miss their next turn.

* **Community & UI Features**:
    * **Leaderboard**: A Hall of Fame that tracks and displays the top commanders by their total wins.
    * **Modern UI**: A clean, responsive user interface with custom modals, icons, and a consistent theme.
    * **Help & Guidance**: An in-game help modal explains all the rules and features to new players.

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
