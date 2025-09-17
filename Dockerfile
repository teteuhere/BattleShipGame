# Dockerfile
FROM python:3.11-slim

ENV PYTHONUNBUFFERED 1
WORKDIR /code

# ADD THIS LINE to install system dependencies for mysqlclient
RUN apt-get update && apt-get install -y build-essential default-libmysqlclient-dev pkg-config

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .