# Use the official Node.js 20.x image as the base image
FROM node:20.11.0

# Install pnpm globally
RUN npm install -g pnpm@9.12.2

# Set the working directory inside the container
WORKDIR /usr/src/backend

# Expose the desired port (e.g., 3000 for a typical Node.js app)
EXPOSE 3000

# From the base image, create a development image
FROM base as dev

# Copy package.json and pnpm-lock.yaml first for dependency resolution
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Start the application (update the command based on your app's entry point)
CMD ["pnpm", "start:dev"]
