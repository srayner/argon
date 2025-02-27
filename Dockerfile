# Use a base image
FROM node:18-alpine

# Add openssl
RUN apk add --no-cache openssl

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY actions ./actions
COPY app ./app
COPY components ./components
COPY data ./data
COPY hooks ./hooks
COPY lib ./lib
COPY prisma ./prisma
COPY public ./public
COPY schemas ./schemas
COPY types ./types
COPY uploads ./uploads
COPY *.ts ./
COPY *.json ./
COPY *.mjs ./

RUN npx prisma generate

# Build the application
RUN npm run build

RUN npm prune --production

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
