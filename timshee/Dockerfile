FROM python:3.12.1-slim-bookworm

ENV PYTHONUNBUFFERED 1

RUN mkdir /app
WORKDIR /app

COPY requirements.txt /app

RUN pip install -r requirements.txt

COPY . /app