FROM node:alpine as builder
WORKDIR /usr/walker
COPY package.json .
RUN npm install
RUN mkdir -p src dist
COPY ./src ./src/
COPY ./tsconfig.json ./build.js ./.babelrc .
RUN ./build.js > dist/bundle.js

FROM nginx:stable-alpine as production-stage
WORKDIR /usr/share/nginx/html
COPY ./ ./
RUN mkdir -p dist
COPY --from=builder /usr/walker/dist/bundle.js ./dist/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
