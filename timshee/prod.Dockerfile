FROM python:3.12.1-slim-bookworm

#NODE
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g mjml \
    && apt-get purge -y --auto-remove \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV PYTHONUNBUFFERED 1
ENV APP_HOME=/home/timshee_store_app/app

WORKDIR $APP_HOME

COPY requirements.txt $APP_HOME

RUN pip install --no-cache-dir -r $APP_HOME/requirements.txt

COPY . $APP_HOME

EXPOSE 8111