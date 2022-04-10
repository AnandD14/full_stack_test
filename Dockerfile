FROM node:17.8.0
#defining working diretory in the image
RUN mkdir -p /usr/app
WORKDIR /usr/app

#copy from project to our working directory
COPY package*.json /usr/app

#installing all our dependecies
RUN npm install

COPY . /usr/app

RUN npm run build

EXPOSE 3000

CMD ["npm","run","dev"]