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
  
};
const addSkills = async (req, res) => {};
const editSkills = async (req, res) => {};
const changePassword = async (req, res) => {};
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
};
