FROM node:20

# Install build tools and SQLite headers
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  sqlite3 \
  libsqlite3-dev \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port and run app
EXPOSE 3000
CMD ["npm", "run", "start"]
