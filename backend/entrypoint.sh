#!/bin/bash

# Wait for Postgres to be ready
until nc -z -v -w30 db 5432; do
  echo "Waiting for database connection..."
  sleep 1
done

# Run migrations and start server
python manage.py migrate
gunicorn project.wsgi:application --bind 0.0.0.0:8000
