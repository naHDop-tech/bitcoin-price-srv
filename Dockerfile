FROM node:16-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

# ---

FROM node:16-alpine

ENV NODE_ENV prod

USER node
WORKDIR /home/node

RUN npm i concurrently

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/src/ ./dist/src
COPY --from=builder --chown=node:node /home/node/dist/ticker-srv/ ./dist/ticker-srv
COPY --from=builder --chown=node:node /home/node/btc-usdt-ticker.sqlite ./

CMD ["npm", "run", "run:prod"]