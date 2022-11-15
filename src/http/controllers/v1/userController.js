const User = require("../../../models/v1/user");
const fs = require("fs");
const bcrypt = require('bcryptjs');

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.json({
      status: 200,
      success: true,
      message: "عملیات موفقیت آمیز بود",
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          userName: user.userName,
          roles: user.roles,
          skills: user.skills,
          teams: user.teams,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const editProfile = async (req, res) => {
  try {
    //check that email is unique
    let findUser = await User.findOne({ email: req.body.email });
    if (findUser && String(findUser._id) !== String(req.user._id)) {
      throw new Error("این ایمیل قبلا ثبت شده است");
    }

    // check that mobile is unique
    findUser = await User.findOne({ mobile: req.body.mobile });
    if (findUser && String(findUser._id) !== String(req.user._id)) {
      throw new Error("این شماره موبایل قبلا ثبت شده است");
    }

    const result = await User.updateOne(req.body);
    if (result.acknowledged && result.modifiedCount > 0) {
      return res.status(200).json({
        message: "عملیات موفقیت آمیز بود",
        status: 200,
        success: true,
      });
    } else {
      throw new Error(
        "مشکلی هنگام بروزرسانی اطلاعات پروفایل کاربری شما پیش آمد"
      );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    if (req.file) {
      // check if user have avatar
      if (req.user.avatar) {
        fs.unlinkSync(`./public${req.user.avatar}`);
        console.log(`User old Avatar deleted`);
      }

      const result = await User.updateOne(
        { _id: req.user._id },
        {
          avatar: req.file.destination.substring(8) + "/" + req.file.filename,
        }
      );

      if (result?.acknowledged && result?.modifiedCount > 0) {
        return res.status(200).json({
          message: "عملیات موفقیت آمیز بود",
          status: 200,
          success: true,
        });
      } else throw new Error("مشکلی هنگام بروزرسانی اواتار کاربر پیش آمد");
    } else throw new Error("ارسال فایل عکس الزامی است");
  } catch (err) {
    console.log(err);
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log(err);
        console.log("file deleted successfully!");
      });
    }
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const addSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    const userSkills = [...req.user.skills];

    if (skills.length > 0) {
      for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        if (!userSkills.includes(skill)) userSkills.push(skill);
      }

      const response = await req.user.updateOne({
        skills: userSkills,
      });

      if (response.acknowledged && response.modifiedCount > 0) {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "عملیات موفقیت آمیز بود",
        });
      } else {
        throw new Error("مشکلی هنگام بروزرسانی مهارت های کاربر به وجود امد");
      }
    } else {
      throw new Error("فیلد مهارت ها الزامی است");
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const editSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    const userSkills = [];

    if (skills.length > 0) {
      for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        if (!userSkills.includes(skill)) userSkills.push(skill);
      }

      const response = await req.user.updateOne({
        skills: userSkills,
      });

      if (response.acknowledged && response.modifiedCount > 0) {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "عملیات موفقیت آمیز بود",
        });
      } else {
        throw new Error("مشکلی هنگام بروزرسانی مهارت های کاربر به وجود امد");
      }
    } else {
      throw new Error("فیلد مهارت ها الزامی است");
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if(bcrypt.compareSync(oldPassword, req.user.password)) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);
      const response = await req.user.updateOne({
        password: hash,
      });

      if(response.acknowledged && response.modifiedCount > 0) {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "عملیات موفقیت آمیز بود"
        });
      }else{
        throw new Error("بروزرسانی رمز عبور شما انجام نشد - لطفا بعدا دوباره امتحان کنید");
      }
    }else{
      throw new Error("رمز عبور قدیم اشتباه وارد شده است");
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};
const acceptInviteInTeam = async (req, res) => {};
const rejectInviteInTeam = async (req, res) => {};

module.exports = {
  getUserProfile,
  editProfile,
  addSkills,
  editSkills,
  changePassword,
  acceptInviteInTeam,
  rejectInviteInTeam,
  updateUserAvatar,
};
