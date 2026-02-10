FROM node:22-alpine

WORKDIR /app

# Copy application files
COPY --chown=node:node . .

# Install dependencies
RUN npm install --prefer-offline --no-audit

# Create simple entrypoint to fix permissions on startup
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'chown -R node:node /app 2>/dev/null || true' >> /entrypoint.sh && \
    echo 'mkdir -p /app/.next && chown -R node:node /app/.next 2>/dev/null || true' >> /entrypoint.sh && \
    echo 'exec su-exec node "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh && \
    apk add --no-cache su-exec

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "run", "dev"]
