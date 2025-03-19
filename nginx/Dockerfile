# Use the official Nginx image from the Docker Hub
FROM nginx:alpine

# Copy your custom Nginx configuration file into the container
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
