FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install app dependencies (skip dev dependencies)
RUN npm install --only=production

# Bundle app source
COPY . .

# Start app
CMD [ "node", "server.js" ]
