FROM node:lts-iron

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start:prod"]
