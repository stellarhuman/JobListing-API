require('dotenv').config();
require('express-async-errors');

//extra security headers:
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')




const express = require('express');
const app = express();

const authRouter = require('./routes/auth')
const jobRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra packages
app.use(rateLimit({
  windowMs : 15 * 60 *1000,
  max : 100
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())


const connectDB = require('./db/connect')

const authenticateUser = require('./middleware/authentication');
const { RateLimiter } = require('rate-limiter');
// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
