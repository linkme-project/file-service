FROM node:latest
RUN mkdir -p /usr/src/app/
RUN mkdir /usr/src/app/uploads/		# File Upload Path. It should be same to application upload path (in .env)
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install -g yarn
RUN yarn install
COPY . /usr/src/app
EXPOSE 3000
CMD yarn start:dev
