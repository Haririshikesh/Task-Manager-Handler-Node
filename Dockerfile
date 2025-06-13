# Stage 1: Build the application
# This stage uses a Node.js image as its base.
# The 'AS builder' gives this stage a name so you can reference it later.
FROM node:20-alpine AS builder

# Set the working directory inside the builder container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install production dependencies
RUN npm install --production --silent

# Copy the rest of the application code
COPY . .

# Stage 2: Create the final lean image
# This stage uses a very minimal Alpine Linux image as its base
FROM alpine:latest

# Install ca-certificates for HTTPS requests (often needed for external APIs)
RUN apk add --no-cache ca-certificates

# Set the working directory for the final image
WORKDIR /app

# Copy just the necessary files from the 'builder' stage
# This refers to the stage named 'builder' defined above.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./ # Add this if you rely on package.json at runtime
COPY --from=builder /app/server.js ./    # Your main application file

EXPOSE 3000
CMD ["node", "server.js"]