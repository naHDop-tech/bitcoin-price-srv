FROM node:16-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build \
    && npm prune --production

# ---

FROM node:16-alpine

ENV NODE_ENV prod

USER node
WORKDIR /app

COPY --from=builder . .

CMD ["npm", "run", "start:prod"]