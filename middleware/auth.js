import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
const { TOKEN_KEY } = process.env;
const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentification");
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;

  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
  return next();
};

export default verifyToken;