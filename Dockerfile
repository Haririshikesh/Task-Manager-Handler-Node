# Stage 2: Create the final lean image
FROM alpine:latest

# Install ca-certificates for HTTPS requests (often needed for external APIs)
RUN apk add --no-cache ca-certificates

# Set the working directory for the final image
WORKDIR /app

# Copy just the necessary files from the builder stage
# These are the typical required files for a Node.js app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server.js ./

# Ensure no other COPY commands are trying to copy directories onto files,
# especially if you had other `COPY` lines uncommented or added.
# For example, if you uncommented and `src` or `dist` are directories:
# COPY --from=builder /app/src ./src/
# COPY --from=builder /app/dist ./dist/
# Note the trailing slashes which clarify they are directories

EXPOSE 3000
CMD ["node", "server.js"]