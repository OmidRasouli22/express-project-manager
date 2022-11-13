const User = require("../../../models/v1/user");
const {
  hashString,
  checkHashString,
  tokenGenerator,
} = require("../../../utils/helpers");

const registerUser = async (req, res) => {
  try {
    const { userName, email, mobile, password } = req.body;

    // check email is unique
    let findUser = await User.findOne({
      email,
    });

    if (findUser) throw new Error("این ایمیل قبلا ثبت شده است");

    findUser = await User.findOne({
      mobile,
    });

    if (findUser) throw new Error("این شماره موبایل قبلا ثبت شده است");

    const newUser = await User.create({
      userName,
      email,
      mobile,
      password: hashString(password),
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "عملیات موفقیت آمیز بود",
      data: newUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است - با پشتیبانی تماس بگیرید",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { payload, password } = req.body;
    let findUser = await User.findOne({
      $or: [{ email: payload }, { mobile: payload }],
    });

    if (!findUser)
      throw new Error("کاربری با ایمیل یا شماره موبایل وارد شده یافت نشد");

    const check = checkHashString(password, findUser.password);

    if (!check) throw new Error("کاربری با مشخصات وارد شده یافت نشد");

    let tokenPayload = { user_id: findUser._id };
    let options = { expiresIn: "1d" };

    return res.status(200).json({
      status: 200,
      success: true,
      data: {
        token: await tokenGenerator(tokenPayload, options),
      },
      message: "شما با موفقیت لاگین کردید",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است - با پشتیبانی تماس بگیرید",
    });
  }
};

const forgotPasswordUser = async (req, res) => {};
const resetPasswordUser = async (req, res) => {};

module.exports = {
  registerUser,
  loginUser,
  forgotPasswordUser,
  resetPasswordUser,
};
