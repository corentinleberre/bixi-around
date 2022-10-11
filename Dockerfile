FROM node:16-alpine as builder

ENV NODE_ENV build

WORKDIR /home/node/bixi-around

COPY --chown=node:node . .
RUN npm ci
RUN npm run build && npm prune --production

# --- MINIFY

FROM node:16-alpine as minified

ENV NODE_ENV production

WORKDIR /home/node/bixi-around

COPY --from=builder --chown=node:node /home/node/bixi-around/package*.json ./
COPY --from=builder --chown=node:node /home/node/bixi-around/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/bixi-around/dist/ ./dist/

CMD ["npm", "run", "start"]