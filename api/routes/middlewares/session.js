const dbo = require("../../db/conn");
const { PUBLIC_USER_PROJECTION } = require("../../models/projections");

async function getSessionUser(req, res, next) {
    try {
      const dbConnect = dbo.getDb();
      const session = req.cookies.session;
      if (session) {
        const sessionUser = await dbConnect
          .collection("users")
          .findOne({ session }, { projection: PUBLIC_USER_PROJECTION });
        if (sessionUser) {
          req.sessionUser = sessionUser;
        }
      }
      if (next) {
        return next();
      }
    } catch (err) {
      if (next) {
        return next(err);
      }
      return Promise.reject(err);
    }
  }

async function sessionOnly(req, res, next) {
    try {
      await getSessionUser(req, res);
      if (!req.sessionUser) {
        throw new Error("invalid session");
      }
      return next();
    } catch (err) {
      return next(err);
    }
  }


module.exports.getSessionUser = getSessionUser;
module.exports.sessionOnly = sessionOnly;
