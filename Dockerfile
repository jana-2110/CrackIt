# Stage 1: Build the frontend
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Setup the backend and serve the app
FROM node:18-alpine

WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

# Copy backend code
COPY backend/ .

# Copy built frontend assets from Stage 1 to backend/public (or a suitable folder)
COPY --from=frontend-build /app/frontend/dist ./client/dist

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "index.js"]
