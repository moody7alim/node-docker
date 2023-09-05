const express = require('express');
const mongoose = require('mongoose');
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const cors = require('cors');
const { MONGO_IP, MONGO_PASSWORD, MONGO_USER, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');


// docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

// docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build -V
// docker-compose -f docker-compose.yml -f docker-compose.dev.yml down 


// docker exec -it node-app-redis-1 redis-cli. get key, kEY *

const RedisStore = require('connect-redis').default;
const session = require('express-session');
const redis = require('redis');

const redisClient = redis.createClient({ url: `redis://${REDIS_URL}:${REDIS_PORT}` });

// this does not work

// redisClient.on('error', (err) => {
//   console.log('Redis error: ', err);
// });
redisClient.on('connect', () => {
  console.log('Redis client connected');
});
redisClient.connect();



const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("MongoDB Connected");
  }).catch(err => {
    console.log(err);
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();



const app = express();


// when using nginx as a reverse proxy, we need to tell express that it is behind a proxy
app.enable('trust proxy');
app.use(session({
  proxy: true,
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 30000      // in ms
  }
}));



app.use(express.json());
app.use(cors());

app.use('/api/v1/posts', authMiddleware, postRouter);
app.use('/api/v1/users', userRouter);


app.use('/api/v1', (req, res, next) => {
  res.send("YEEEAH BOOY");
  console.log("YEEEAH BOOY");
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`http://localhost:${port}`);
});