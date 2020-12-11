FROM node:10

MAINTAINER guoxiuqiong<wallam2sophia@163.com>

RUN mkdir -p /home/www/todo
WORKDIR /home/www/todo

COPY . /home/www/todo

RUN npm install

EXPOSE 8090

ENTRYPOINT ["npm", "run"]
CMD ["start"]