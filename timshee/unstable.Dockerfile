FROM python:3.12.1-slim-bookworm

ENV PYTHONUNBUFFERED 1
ENV APP_HOME=/home/timshee_store_app/app

WORKDIR $APP_HOME

COPY requirements.txt $APP_HOME

RUN pip install -r $APP_HOME/requirements.txt

COPY . $APP_HOME

EXPOSE 8112