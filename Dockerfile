FROM node:16
WORKDIR /hyper+
COPY package.json /hyper+
COPY package-lock.json ./
RUN npm install
COPY . /hyper+
CMD node main.js