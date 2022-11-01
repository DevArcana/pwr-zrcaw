tmp=$(mktemp)
jq ".api = \"$API_URL\"" /usr/share/nginx/html/config.json > "$tmp" && mv "$tmp" /usr/share/nginx/html/config.json
chmod 666 /usr/share/nginx/html/config.json