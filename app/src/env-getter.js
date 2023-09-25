//const secret_prod = require("./private/secret-prod.js");
const secret_prod=""

require("dotenv").config({
  path: process.env.NODE_ENV == "production"
});

function getEnvMongoURI() {
  return process.env.NODE_ENV == "production"
    ? secret_prod.MONGOURI_PRODUCTION
    : process.env.MONGOURI;
}

function getEnvMongoDBName() {
  return process.env.NODE_ENV == "production"
    ? secret_prod.MONGODBNAME_PRODUCTION
    : process.env.MONGODBNAME;
}

function getEnvCookieSecret() {
  return process.env.NODE_ENV == "production"
    ? secret_prod.COOKIESECRET
    : process.env.COOKIESECRET;
}
function getEnvSessionSecret() {
  return process.env.NODE_ENV == "production"
    ? secret_prod.SESSIONSECRET_PRODUCTION
    : process.env.SESSIONSECRET;
}

function getEnvApiUrl() {  
  return process.env.NODE_ENV == "production"
    ? process.env.HRCOMAPIRUL_PRODUCTION
    : process.env.SHTFOLIOAPIURL;
}


module.exports = {
  getEnvMongoURI,
  getEnvCookieSecret,
  getEnvSessionSecret,  
  getEnvApiUrl,
  getEnvMongoDBName
};
