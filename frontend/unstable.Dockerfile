FROM node:22-alpine3.19 as base

FROM base as builder

WORKDIR /app

COPY ./timshee .

RUN \
   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
   elif [ -f package-lock.json ]; then npm ci; \
   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
   else echo "Lockfile not found." && exit 1; \
   fi

RUN \
   if [ -f yarn.lock ]; then yarn build; \
   elif [ -f package-lock.json ]; then npm run build:unstable; \
   elif [ -f pnpm-lock.yaml ]; then pnpm build; \
   else npm run build:unstable; \
   fi



FROM base as runner

WORKDIR /app

RUN \
   addgroup --system --gid 1001 nodejs; \
   adduser --system --uid 1001 reactjs;

COPY react.start.js .

COPY --from=builder /app /app
COPY --from=builder --chown=nextjs:reactjs /app /app
COPY --from=builder --chown=nextjs:reactjs /app /app

EXPOSE 3000