FROM node:14

WORKDIR /app/consumers

COPY package*.json ./

RUN npm install

COPY . .

RUN apt-get update && apt-get install -y netcat
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT [ "docker-entrypoint.sh" ]