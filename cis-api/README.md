# About cis-api
##### Environment
    - pyenv to manage python versions, this project uses python 3.8.6, https://github.com/pyenv-win/pyenv-win
    - direnv to help us preload env configuration and such each time we switch to this project directory, https://direnv.net/
    - pip for package management
    - .env and dotenv for env file management (example.env provided)
    
##### FastAPI
    - see fastapi on the internet, https://fastapi.tiangolo.com/

###### SQLAlchemy and Models
    - we use sqlalchemy for our dataaccess functionality, https://www.sqlalchemy.org/
    - to create a new migration we add the model(s) to the models/cis.py, then we run the alembic revision stuff
        and finally we review the alembic migration to ensure that it didn't output unnecessary code

##### Pydantic and Schemas
    - we use a single schemas.py file

###### Data Migrations with Alembic
    NOTE:// all commands need to be run from the root directory
    - How to create a new auto generated migration:
        - always ensure you're at current before doing another migration: alembic upgrade head
        - alembic revision --autogenerate -m "My Migration"
        - file should arrive in alembic/versions/xxxx-my_migration.py
    - How to migrate:
        - alembic upgrade head
    - How to downgrade migration:
        - alembic downgrade base
    - How to view:
        - alembic current
    - Auto migrations:
        - we bake alembic upgrade head into our prestart.sh script, this automatically performs migrations
            for us in all environments within our docker container
    - More at:
        We're using a singledb default
        https://alembic.sqlalchemy.org/en/latest/tutorial.html

###### Package Management
     - we use pip, https://pypi.org/
     - pip install my_package
     - pip freeze > requirements.txt


##### Database Structure:
    - follows the original structure with changes as documented in the rewrite document