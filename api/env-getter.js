//const secret_prod = require("./private/secret-prod.js");

require("dotenv").config({
  path: process.env.NODE_ENV == "production"
});

function getEnvMongoURI() {
  return process.env.NODE_ENV == "production"
    ? process.env.MONGOURI_PRODUCTION
    : process.env.MONGOURI;
}

function getEnvMongoDBName() {
  return process.env.NODE_ENV == "production"
    ? process.env.MONGODBNAME_PRODUCTION
    : process.env.MONGODBNAME;
}

function getEnvCookieSecret() {
  return process.env.NODE_ENV == "production"
    ? process.env.COOKIESECRET
    : process.env.COOKIESECRET;
}
function getEnvSessionSecret() {
  return process.env.NODE_ENV == "production"
    ? process.env.SESSIONSECRET_PRODUCTION
    : process.env.SESSIONSECRET;
}

function getEnvApiUrl() {
  return process.env.NODE_ENV == "production"
    ? process.env.HRCOMAPIRUL_PRODUCTION
    : process.env.HRCOMAPIURL;
}


module.exports = {
  getEnvMongoURI,
  getEnvCookieSecret,
  getEnvSessionSecret,  
  getEnvApiUrl,
  getEnvMongoDBName
};
