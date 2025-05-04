# Use an official Node.js runtime as the base image
FROM node:18.20.4-alpine

FROM mcr.microsoft.com/playwright:v1.43.1-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY . .

# Install dependencies using yarn
RUN yarn
RUN yarn workspace intelligent-crawler-server postinstall

# Expose the port the app runs on (adjust as needed)
EXPOSE 3000

# Define the command to run the application
CMD ["yarn", "start"]