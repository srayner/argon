# Use a base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY app ./app
COPY prisma ./prisma
COPY public ./public
COPY *.ts ./
COPY *.json ./
COPY next.config.mjs ./

RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
