const Team = require("../../../models/v1/team");
const User = require("../../../models/v1/user");
const { slugify } = require("../../../utils/helpers");

const createTeam = async (req, res) => {
  try {
    const { name, description, userName } = req.body;

    // check that userName is unique
    const findTeam = await Team.findOne({ userName });
    if (findTeam)
      throw new Error("این یوزرنیم قبلن برای تیمی دیگر ثبت شده است");

    const newTeam = await Team.create({
      name,
      slug: slugify(name),
      userName,
      description,
      owner: req.user._id,
    });

    if (!newTeam) throw new Error("مشکلی هنگام ساخت تیم جدید پیش آمد");

    return res.status(200).json({
      status: 200,
      success: true,
      data: newTeam,
      message: "عملیات موفقیت آمیز بود",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const allTeam = async (req, res) => {
  try {
    const teams = await Team.find({
      owner: req.user._id,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      data: teams,
      message: "عملیات موفقیت آمیز بود",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const findOneTeam = async (req, res) => {
  try {
    const team = await getTeamById(req);
    if (!team) throw new Error("ای دی نامعتبر یا سطح دسترسی نا معتبر");

    return res.status(200).json({
      status: 200,
      success: true,
      data: team,
      message: "عملیات موفقیت آمیز بود",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const getMyTeams = async (req, res) => {
  try {
    const userId = req.user._id;
    const teams = await Team.find({
      $or: [{ owner: userId }, { users: { $in: [userId] } }],
    });

    return res.status(200).json({
      status: 200,
      success: true,
      data: teams,
      message: "عملیات موفقیت آمیز بود",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await getTeamById(req);
    if (!team) throw new Error("ای دی نامعتبر یا سطح دسترسی نا معتبر");

    const result = await team.deleteOne();
    if (!result) throw new Error("مشکلی هنگام حدف تیم پیش آمد");

    return res.status(200).json({
      status: 200,
      success: true,
      data: result,
      message: "عملیات موفقیت آمیز بود",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const inviteUserToTeam = async (req, res) => {
  try {
    const { team_id, user_id } = req.params;

    if (!team_id || !user_id) throw new Error("اطلاعات ضروری را بفرستید");

    // find team
    const team = await Team.findOne({ _id: team_id });
    if (!team) throw new Error("ای دی تیم نامعتبر است");

    // find User
    const user = await User.findOne({ _id: user_id });
    if (!user) throw new Error("ای دی کاربر نامعتبر است");

    const findTeam = await Team.findOne({
      $and: [
        { $or: [{ owner: req.user._id }, { users: { $in: [req.user._id] } }] },
        { _id: team._id },
      ],
    });

    if (!findTeam) throw new Error("تیمی جهت دعوت کردن افراد یافت نشد");

    const requester = {
      inviter: req.user._id,
      team: team_id,
      requestDate: new Date(),
      status: 0,
    };

    console.log({requester})

    const result = await User.updateOne(
      { _id: user_id },
      {
        $set: { inviteRequests: { $push: requester } },
      }
    );

    if (result?.acknowledged && result?.modifiedCount > 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "عملیات موفقیت آمیز بود",
      });
    } else {
      throw new Error("مشکلی پیش آمد");
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش آمده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const updateTeam = async (req, res) => {};
const removeUserFromTeam = async (req, res) => {};

const getTeamById = async (req) => {
  const teamId = req.params.team_id;
  console.log({ teamId });
  if (!teamId) throw new Error("ارسال ای دی تیم الزامی است");
  const team = await Team.findOne({
    $and: [{ _id: teamId }, { owner: req.user._id }],
  });

  return team;
};

module.exports = {
  createTeam,
  inviteUserToTeam,
  deleteTeam,
  updateTeam,
  removeUserFromTeam,
  allTeam,
  findOneTeam,
  getMyTeams,
};
