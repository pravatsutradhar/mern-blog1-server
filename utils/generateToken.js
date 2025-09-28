// backend/utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (payload) => {
    const options = {
    expiresIn: '7d',
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}


export default generateToken;