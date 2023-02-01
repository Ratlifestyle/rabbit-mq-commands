#!/bin/bash

while ! nc -z rabbitmq 5672; do
    echo "waiting for rabbitmq container..."
    sleep 1
done

node index.js