FROM python:3.12.5-alpine3.20 as builder

RUN apk add --no-cache nodejs npm build-base libffi-dev postgresql-dev; \
    npm install -g mjml

WORKDIR /app-build

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip; \
    pip install --no-cache-dir -r requirements.txt


FROM python:3.12.5-alpine3.20

RUN apk add --no-cache libpq nodejs

COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /usr/local/lib/node_modules/mjml /usr/local/lib/node_modules/mjml
COPY --from=builder /usr/lib/node_modules /usr/lib/node_modules

ENV PYTHONUNBUFFERED=1
ENV PATH="/usr/local/bin:/usr/lib/node_modules/.bin:${PATH}"
ENV APP_HOME=/home/timshee_store_app/app

WORKDIR $APP_HOME

COPY . $APP_HOME

RUN rm -rf /var/cache/apk/*

EXPOSE 8111