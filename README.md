After cloning the repository, execute the following command at the root directory to initialize the database:

`docker-compose exec python-app uv run alembic upgrade head`

Build the docker images and containers using the following command:

`docker-compose up`

Stop the container using the follow command:

`docker-compose down`

