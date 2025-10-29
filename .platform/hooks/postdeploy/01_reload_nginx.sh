#!/bin/bash
# Ensure SSL config exists and Nginx reloads after deploy
if [ -f /etc/nginx/conf.d/ssl.conf ]; then
  echo "Reloading Nginx with custom SSL config..."
  systemctl reload nginx
else
  echo "SSL config missing, restoring from platform directory..."
  cp /var/app/current/.platform/nginx/conf.d/ssl.conf /etc/nginx/conf.d/
  systemctl reload nginx
fi
