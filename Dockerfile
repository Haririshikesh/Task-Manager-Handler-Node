FROM node:20-alpine AS builder

# Set the working directory inside the builder container
WORKDIR /app # So, /app is now the current directory

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./ # Copies package.json from your host into /app/

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
# These are the typical required files for a Node.js app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server.js ./

# IMPORTANT: Ensure NO other 'COPY' commands here try to use 'runtime' as a destination
# If you had lines like:
# COPY --from=builder /app/some_folder ./runtime  <-- THIS WOULD CAUSE THE ERROR IF ./runtime IS A FILE
# Make sure such lines are commented out or removed if they are causing conflict.

EXPOSE 3000
CMD ["node", "server.js"]