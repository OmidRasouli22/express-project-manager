const Project = require("../../../models/v1/project");
const { slugify } = require("../../../utils/helpers");

const createProject = async (req, res) => {
  try {
    const { title, text, isPrivate, tags } = req.body;

    // TODO find team
    const newProject = await Project.create({
      title,
      slug: slugify(title),
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

const getProjectById = async (req, res) => {
  try {
    const project = await findProject(req);

    if (!project) throw new Error("ای دی پروژه نامعتبر یا سطح دسترسی نامعتبر");

    return res.status(200).json({
      status: 200,
      success: true,
      message: "عملیات موفقیت آمیز بود",
      data: project,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش امده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const getAllProjectsByTeamId = async (req, res) => {};

const updateProject = async (req, res) => {
  try {
    const { title, text, tags, isPrivate } = req.body;

    let image;

    const project = await findProject(req);

    if (!project) throw new Error("ای دی پروژه نامعتبر یا سطح دسترسی نامعتبر");

    if (req.file && req.file !== undefined) {
      // check if user have avatar
      if (project.image) {
        fs.unlinkSync(`./public${project.image}`);
      }

      image = req.file.destination.substring(8) + "/" + req.file.filename;
    } else {
      image = project.image;
    }

    const result = await project.updateOne({
      title,
      slug: slugify(title),
      text,
      tags,
      isPrivate,
      image,
    });

    if (result?.acknowledged && result?.modifiedCount > 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "عملیات موفقیت آمیز بود",
      });
    } else {
      throw new Error("مشکلی هنگام بروزرسانی پروژه پیش آممد");
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش امده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await findProject(req);

    if (!project) throw new Error("ای دی پروژه نامعتبر یا سطح دسترسی نامعتبر");

    const result = await project.deleteOne();
    if (!result) throw new Error("مشکلی هنگام حذف پروژه پیش امد");

    return res.status(200).json({
      status: 200,
      success: true,
      message: "عملیات موفقیت آمیز بود",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "مشکلی پیش امده است لطفا با پشتیبانی تماس بگیرید",
    });
  }
};

const findProject = async (req) => {
  const { project_id } = req.params;
  const project = await Project.findOne({
    $and: [{ _id: project_id }, { owner: req.user._id }],
  });

  return project;
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getAllProjectsByTeamId,
  updateProject,
  deleteProject,
};
