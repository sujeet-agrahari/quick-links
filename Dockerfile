# Use node base image with tag 18-slim
FROM node:20-slim as base

# Set NODE_ENV environment variable to production
ENV NODE_ENV=production

# don't know why nest isn't available on path even it's part of deps
RUN npm i -g @nestjs/cli

# Expose port 3000
EXPOSE 3000

# Create app directory and set permissions
WORKDIR /app
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Set PATH environment variable in dev stage
ENV PATH /app/node_modules/.bin:$PATH

# Copy source code
COPY --chown=node:node . .

# Development stage
FROM base as dev

# Set NODE_ENV environment variable to development
ENV NODE_ENV=development

# Command to run development server
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base as prod

# Build production code
RUN npm run build

# Command to run production server
CMD ["node", "dist/main.js"]
