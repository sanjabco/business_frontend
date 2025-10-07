# Stage 1: Build the React application
FROM node:22.18.0-alpine AS builder
WORKDIR /app

# Copy dependency files to leverage Docker cache.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application source code.
COPY . .

# Build the app, generating static assets in the "dist" folder.
RUN npm run build

# Stage 2: Serve build artifacts using Nginx (Debian-based)
FROM nginx

# Remove default Nginx static files.
RUN rm -rf /usr/share/nginx/html/*

# Copy build files from the builder stage into Nginx's document root.
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Expose port 80 for HTTP traffic.
EXPOSE 80

# Start Nginx in the foreground.
CMD ["nginx", "-g", "daemon off;"]