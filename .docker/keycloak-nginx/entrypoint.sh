#!/bin/sh
set -eu

cat > /etc/nginx/conf.d/default.conf << EOF
server {
    listen 8081 default_server;
    listen [::]:8081 default_server;

    proxy_buffer_size 8k;

    location / {
        proxy_set_header        Host $HOST_NAME;
        proxy_set_header        X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto https;
        proxy_pass              $UPSTREAM_URI;
    }
}
EOF

/docker-entrypoint.sh nginx -g 'daemon off;'
