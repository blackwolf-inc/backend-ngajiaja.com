const express = require('express');
const searchFiles = require('./utils/fileSystem');

module.exports = async () => {
  try {
    const app = express();
    app.set('trust proxy', true);

    // Register all available modules
    const object = await searchFiles('router.js', './src/modules');
    for (const property in object) {
      const router = require(`./../${object[property]}`.replace('\\', '/'));
      app.use(`/${property}`, router);
    }
    return app;
  } catch (error) {
    throw error;
  }
};
