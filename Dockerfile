# Dockerfile
# Base image: Python 3.11 on a slim Debian OS
FROM python:3.11-slim

# --- Environment Variables ---
# This ensures that Python output is sent straight to the terminal without being buffered first.
ENV PYTHONUNBUFFERED 1
# This sets up NVM (Node Version Manager) and the specific Node.js version we want to install.
ENV NVM_DIR="/root/.nvm"
ENV NODE_VERSION="20.11.1"

# Set the working directory inside the container. All subsequent commands will run from here.
WORKDIR /code

# --- System Dependencies ---
# This block updates the package list and installs essential tools. We've added 'git' and 'curl'
# which are needed to download and install NVM and Docker Compose.
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# --- Install Node.js using NVM ---
# This is the best way to install Node.js! It downloads the NVM script, installs the
# specified Node.js version, and sets it as the default for the container.
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# This adds the path to our newly installed Node.js and NPM to the system's PATH,
# making the 'node' and 'npm' commands available everywhere.
ENV PATH="$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH"

# --- Install Docker Compose v2 ---
# This is the modern, recommended way to install Docker Compose. It downloads the
# official binary and installs it as a Docker CLI plugin, which is how it works now!
RUN DOCKER_COMPOSE_VERSION="v2.27.0" \
    && DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker} \
    && mkdir -p $DOCKER_CONFIG/cli-plugins \
    && curl -sSL "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-linux-$(uname -m)" -o $DOCKER_CONFIG/cli-plugins/docker-compose \
    && chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

# --- Python Application Setup ---
# First, copy just the requirements file to leverage Docker's layer caching.
# If this file doesn't change, Docker won't re-run the 'pip install' command on subsequent builds.
COPY requirements.txt .
RUN pip install -r requirements.txt

# Finally, copy the rest of your application code into the container.
COPY . .
