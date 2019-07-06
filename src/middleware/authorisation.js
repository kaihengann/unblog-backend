const jwt = require('jsonwebtoken')

const authorisation = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1];
    const verifyToken = token => jwt.verify(token, process.env.JWT_SECRET);
    const username = verifyToken(token).sub;
    const foundUser = await db.findOne({ username });
    if (foundUser) {
      next()
    }
    return await res.sendStatus(401);
  } catch (err) {
    next(err);
  }
};

module.exports = authorisation
