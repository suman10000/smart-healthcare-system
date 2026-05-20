# 1. Use an official Node runtime as the base
FROM node:18-slim

# 2. Install Python 3 and pip inside the container
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# 3. Create app directory
WORKDIR /usr/src/app

# 4. Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install

# 5. Copy Python requirements and install them 
# (Assuming you have a requirements.txt in Backend, or we can install directly)
RUN pip3 install --no-cache-dir pandas mlxtend requests --break-system-packages

# 6. Copy the rest of the backend source code
COPY . .

# 7. Expose the API port
EXPOSE 4000

# 8. Start the Node server
CMD ["node", "app.js"]