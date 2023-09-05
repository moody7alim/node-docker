FROM node:15

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
  then npm install; \
  else npm install --only=production; \
  fi

# Copy the entire application directory
COPY . .

ENV PORT 3000
EXPOSE $PORT
CMD ["npm", "start"]
