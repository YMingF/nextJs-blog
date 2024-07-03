FROM node:14.0.0
# Create app directory
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
# 你项目中用的什么端口，这里就写啥
EXPOSE 3000
CMD [ "yarn", "start" ]
