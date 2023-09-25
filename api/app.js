var express = require("express");
//var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require('cors');

var v1Router = require("./routes/v1");
const { getEnvCookieSecret } = require("./env-getter");

const ENV_COOKIESECRET = getEnvCookieSecret();

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(ENV_COOKIESECRET));
// This will allow all origins. In production, you should limit this to specific origins.
app.use(cors());
app.use("/api/v1", v1Router);

module.exports = app;
