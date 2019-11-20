FROM node

RUN mkdir -p /app

WORKDIR /app

# Install app dependencies
COPY package.json /app
RUN npm Install

# Bundle app source
COPY . /app

EXPOSE 80
CMD [ "npm", "start" ]