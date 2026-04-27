# Use Nginx to serve the pre-built files
FROM nginx:stable-alpine
# Copy the locally built dist folder
COPY dist /usr/share/nginx/html
# Copy the nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
