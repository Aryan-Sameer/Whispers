FROM node:20.18-alpine AS base

WORKDIR /home/app/server

# install dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# build the app
FROM base AS final
COPY --from=deps /home/app/server/node_modules ./node_modules
COPY . .
EXPOSE 5001
CMD ["node", "src/index.js"]