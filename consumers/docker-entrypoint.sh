#!/bin/bash

while ! nc -z rabbitmq 5672; do
    echo "waiting for rabbitmq container..."
    sleep 1
done
echo "starting API"
node /app/consumers/worker.js