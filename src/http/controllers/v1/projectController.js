const Project = require("../../../models/v1/project");

const createProject = async (req, res) => {
  try {
    const { title, text, isPrivate, tags } = req.body;

    // TODO find team
    const newProject = await Project.create({
      title,
      text,
      owner: req?.user?._id,
      image:
        req?.file?.destination.substring(8) + "/" + req?.file?.filename || null,
      tags,
      isPrivate,
    });

    if (newProject) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "عملیات موفقیت آمیز بود",
        data: newProject,
      });
    } else {
      throw new Error("مکشلی هنگام ساخت پروژه جدید پیش امد");
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش امده است با پشتیبانی تماس بگیرید",
    });
  }
};

const getAllProjects = async (req, res) => {
  try {
    let projects = [];
    projects = await Project.find({
      owner: req.user._id,
    });

    return res.status(200).json({
      status: 200,
      success: false,
      message: "عملیات موفقیت آمیز بود",
      data: projects,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش امده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const getProjectById = async (req, res) => {};

const getAllProjectsByTeamId = async (req, res) => {};

const getAllUserProjects = async (req, res) => {};

const updateProject = async (req, res) => {};

const deleteProject = async (req, res) => {};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getAllProjectsByTeamId,
  getAllUserProjects,
  updateProject,
  deleteProject,
};
