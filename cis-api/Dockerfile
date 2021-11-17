FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim as build

# get all the files and copy them over
COPY ./ /app
WORKDIR /app

# allow prestart.sh execution
RUN chmod +x /app/app/prestart.sh

# runtime
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim AS runtime
WORKDIR /app
COPY --from=build /app ./

# remove some of the default files left around in the image
RUN rm /app/main.py
RUN rm /app/prestart.sh
RUN cp /app/app/prestart.sh /app/prestart.sh

# run pip install
RUN pip install -r requirements.txt
