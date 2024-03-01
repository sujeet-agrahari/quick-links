# Use node base image with tag 16-slim
FROM node:18-slim as base

# Set NODE_ENV environment variable to production
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Install latest version of npm globally
RUN npm i npm@latest -g

# Create app directory and set permissions
RUN mkdir /app && chown -R node:node /app

# Set working directory and user
WORKDIR /app
USER node

# Copy package.json and package-lock.json
COPY --chown=node:node package.json package-lock*.json ./

# Install dependencies and clean npm cache
RUN npm install && npm cache clean --force

# Set PATH environment variable
ENV PATH /app/node_modules/.bin:$PATH

# Healthcheck (optional: uncomment if needed)
# HEALTHCHECK --interval=30s CMD node healthcheck.js

# Stage for source code
FROM base as source

# Copy source code
COPY --chown=node:node . .

# Development stage
FROM source as dev

# Set NODE_ENV environment variable to development
ENV NODE_ENV=development

# Install development dependencies
RUN npm install --only=development

# Command to run development server
CMD ["npm", "run", "start:dev"]

# Production stage
FROM source as prod

# Command to run production server
CMD ["node", "dist/main.js"]
