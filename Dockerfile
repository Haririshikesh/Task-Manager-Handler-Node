FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --production --silent

COPY . .

FROM alpine:latest

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app.js ./ # Or your main entry file

EXPOSE 3000

CMD ["node", "app.js"]