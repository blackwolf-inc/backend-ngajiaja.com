const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();
const dbConnection = require('./models/index');
const routers = require('./router.js');
const ApiError = require('./helpers/errorHandler');
const responseHandler = require('./helpers/responseHandler');
const path = require('path');

class Application {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5050;
    this.plugins();
    this.routers();
    this.start();
  }

  plugins() {
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(helmet());
    this.app.set('view engine', 'ejs');
    this.app.use(morgan('dev'));
    this.app.use(compression());
    this.app.use('/images', express.static('../images'));
    this.app.use('/public', express.static(path.join(__dirname, '../public')));
  }

  async routers() {
    this.app.get('/test', (req, res, next) => {
      responseHandler.succes(res, 'Test route');
    });

    this.app.use('/api/v1', await routers());

    this.app.use((req, res, next) => {
      next(ApiError.notFound('Page not found!'));
    });

    this.app.use((error, req, res, next) => {
      console.error('Error:', error.message);
      return res.status(error.status || error.code || 500).send(error);
    });
  }

  start() {
    this.app
      .listen(this.port, () => {
        console.log('App is running at port ' + this.port);
        dbConnection.sequelize
          .authenticate()
          .then(() => console.log('Success connected to database'))
          .catch((err) => console.log(err.message));
      })
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`Failed to start server, port ${PORT} already in use`);
        } else {
          console.error(err);
        }
      });
  }
}

new Application();
