# Stage 1: Build the React app
FROM node:23.0.0-alpine AS build

WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the frontend code
COPY . .

# Run the build command to create the production-ready build
RUN npm run build  # Run build and check logs directly

# Stage 2: Serve the React app using Nginx
FROM nginx:alpine

# Copy the build files from the 'dist' directory (Vite's default build output) to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the frontend
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
