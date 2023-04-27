FROM node:16-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

# ---

FROM node:16-alpine

ENV NODE_ENV prod

USER node
WORKDIR /app

COPY --from=builder --chown=node:node /app/package*.json .
COPY --from=builder --chown=node:node /app/node_modules/ .
COPY --from=builder --chown=node:node /app/dist/ .
COPY --from=builder --chown=node:node /app/btc-usdt-ticker.sqlite .

CMD ["npm", "run", "start:prod"]