FROM node:16
WORKDIR /hyper+
COPY package.json /hyper+
COPY package-lock.json ./
RUN npm install
RUN yarn install
COPY . /hyper+
CMD node main.js