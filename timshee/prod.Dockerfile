FROM python:3.12.1-slim-bookworm

ENV PYTHONUNBUFFERED 1
ENV APP_HOME=/home/timshee_store_app/app

WORKDIR $APP_HOME

RUN mkdir $APP_HOME/packages
COPY ./packages $APP_HOME/packages

RUN pip install --no-index --find-links=$APP_HOME/packages -r $APP_HOME/packages/requirements.txt

COPY . $APP_HOME

EXPOSE 8111