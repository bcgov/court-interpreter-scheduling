#!/bin/bash
echo "___Local Api run___"

source .env
echo "Reading DB on Host: $DB_SERVICE_HOST:$DB_SERVICE_PORT"

uvicorn app:app --reload --port=8080