FROM node:20.18-alpine AS base

# stage 1
FROM base AS builder
WORKDIR /home/build

RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# stage 2
FROM nginx:alpine AS runner

WORKDIR /home/app/client

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /home/build/dist /usr/share/nginx/html
COPY --from=builder /home/build/package*.json .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
