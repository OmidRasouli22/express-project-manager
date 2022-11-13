const { tokenVerify } = require("../../utils/helpers");
const User = require("../../models/v1/user");

const handle = async (req, res, next) => {
  try {
    const { headers, cookies } = req;

    let token = headers?.authorization || cookies?.authorization || null;
    if (!token) throw new Error("توکن وارد نشده است");

    token = token.split(" ")[1];

    //* token verify
    const result = tokenVerify(token);

    if (!result) throw new Error("توکن نامعتبر است لطغا دوباره امتحان کنید");

    const user = await User.findOne({ _id: result });
    if (!user) throw new Error("توکن نامعتبر است لطغا دوباره امتحان کنید");

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {handle};
