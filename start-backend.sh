#!/bin/bash

echo "Step: Makemigrations"
python manage.py makemigrations

echo "Step: Migrate"
python manage.py migrate

echo "Step: Run"
python manage.py runserver 0.0.0.0:8000