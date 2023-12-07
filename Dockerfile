FROM node:18-alpine as base
RUN apk update && apk add git
WORKDIR /sisgea/env-dev/modules/backend-module-autenticacao

FROM base as prod-deps
COPY package.json .npmrc package-lock.json ./
RUN npm install --omit=dev

FROM prod-deps as dev-deps
RUN npm install

FROM dev-deps as assets
COPY . .
RUN npm run build
RUN rm -rf node_modules

FROM prod-deps
COPY --from=assets /sisgea/env-dev/modules/backend-module-autenticacao /sisgea/env-dev/modules/backend-module-autenticacao
WORKDIR /sisgea/env-dev/modules/backend-module-autenticacao
CMD npm run db:migrate && npm run seed:run && npm run start:prod
