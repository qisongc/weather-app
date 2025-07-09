After cloning the repository and running Docker Desktop. At the root directory, build the docker images and containers using the following command:

`docker-compose up -d`

Execute the following command to initialize the database:

`docker-compose exec python-app uv run alembic upgrade head`

Stop the container using the follow command:

`docker-compose down`

Website: `http://host.docker.internal:3000/`

FastAPI Docs: `http://host.docker.internal:8000/docs`

PostgreSQL: `http://host.docker.internal:8080/`
