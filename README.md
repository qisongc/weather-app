After cloning the repository, at the root directory, build the docker images and containers using the following command:

`docker-compose up -d`

Execute the following command to initialize the database:

`docker-compose exec python-app uv run alembic upgrade head`

Stop the container using the follow command:

`docker-compose down`

