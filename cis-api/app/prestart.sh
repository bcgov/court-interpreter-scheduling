echo "running prestart.sh from $(pwd)"

echo "running alembic upgrade head from prestart.sh"
alembic upgrade head
echo "done running alembic upgrade head from prestart.sh"

echo "done running prestart.sh from $(pwd)"
