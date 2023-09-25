const mongoose = require("mongoose");
const { getEnvMongoURI, getEnvMongoDBName } = require("../env-getter");
const ENV_MONGOURI = getEnvMongoURI();
const ENV_MONGODBNAME = getEnvMongoDBName();

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    mongoose
      .connect(ENV_MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: ENV_MONGODBNAME,
      })
      .then((db) => {
        dbConnection = db;
        console.log("Successfully connected to MongoDB.");
        callback();
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        callback(err);
      });
  },

  getDb: function () {
    return dbConnection;
  },
};