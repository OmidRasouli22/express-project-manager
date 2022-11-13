const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashString = (str) => {
  const salt = bcrypt.genSaltSync(10);
  const hashStr = bcrypt.hashSync(str, salt);

  return hashStr;
};

const checkHashString = (str, hash) => {
  return bcrypt.compareSync(str, hash);
};

const tokenGenerator = async (payload, options) => {
  const token = await jwt.sign(payload, config.jwt_secret_key, options);
  return token;
};

const tokenVerify = (token) => {
  let result = jwt.verify(token, config.jwt_secret_key);
  if (!result?.user_id) return false;

  return result.user_id;
};

module.exports = {
  hashString,
  checkHashString,
  tokenGenerator,
  tokenVerify,
};
