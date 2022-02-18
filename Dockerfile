FROM node:16
WORKDIR /hyper+
COPY package.json /hyper+
COPY package-lock.json ./
RUN echo "Europe/Amsterdam" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata
RUN npm install
COPY . /hyper+
CMD node main.js