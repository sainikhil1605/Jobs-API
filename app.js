require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const authMiddleware = require('./middleware/auth');
const notFoundMiddleware = require('./middleware/notFound');
const errorHandlerMiddleware = require('./middleware/errorHandler');
const connectDB = require('./db/connect');
const helmet = require('helmet');
const cors = require('cors');
const xssClean = require('xss-clean');
const expressRateLimit = require('express-rate-limit');

app.use(helmet());
app.use(cors());
app.use(xssClean());
app.use(
  expressRateLimit({
    WindowMs: 15 * 60 * 1000, // 15 minutes
    Max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use('/api/v1/auth', require('./routes/auth'));

app.use('/api/v1/jobs', authMiddleware, require('./routes/jobs'));
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    connectDB(process.env.CONNECTION_STRING);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
