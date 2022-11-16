const { Router } = require("express");
const router = Router();

//* Controllers
const userController = require("../../../http/controllers/v1/userController");
const projectController = require("../../../http/controllers/v1/projectController");
const teamController = require("../../../http/controllers/v1/teamController");

//* Middlewares
const userAuthenticate = require("../../../http/middlewares/userAuthenticate");
const fileUploadCheck = require("../../../http/middlewares/fileUploadCheck");

//* Validations
const validation = require("../../../http/validations/v1/index");
const upload = require("../../../utils/multer");

router.get(
  "/user/profile",
  userAuthenticate.handle,
  userController.getUserProfile
);

router.put(
  "/edit/user/profile",
  userAuthenticate.handle,
  validation.user.editProfile,
  userController.editProfile
);

router.put(
  "/user/profile/avatar",
  userAuthenticate.handle,
  upload.single("avatar"),
  (req, res, next) => {
    req.tunnel = {
      size: 1024,
      mimeTypes: [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/svg",
        "image/gif",
      ],
    };
    next();
  },
  fileUploadCheck.handle,
  userController.updateUserAvatar
);

router.put(
  "/user/add/skills",
  userAuthenticate.handle,
  validation.user.checkSkills,
  userController.addSkills
);

router.put(
  "/user/edit/skills",
  userAuthenticate.handle,
  validation.user.checkSkills,
  userController.editSkills
);

router.put(
  "/user/change/password",
  userAuthenticate.handle,
  validation.user.changePassword,
  userController.changePassword
);

//!!!!!!!!!!!!!!!!   Project Routes
//create project
router.post(
  "/create/project",
  userAuthenticate.handle,
  validation.project.createNewProject,
  upload.single("image"),
  (req, res, next) => {
    req.tunnel = {
      size: 2048,
      mimeTypes: [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/svg",
        "image/gif",
      ],
    };
    next();
  },
  fileUploadCheck.handle,
  projectController.createProject
);

// edit a project
router.put(
  "/projects/edit/:project_id",
  userAuthenticate.handle,
  validation.project.createNewProject,
  upload.single("image"),
  (req, res, next) => {
    req.tunnel = {
      size: 2048,
      mimeTypes: [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/svg",
        "image/gif",
      ],
    };
    next();
  },
  fileUploadCheck.handle,
  projectController.updateProject
);

// all projects
router.get(
  "/all/projects/:project_id",
  userAuthenticate.handle,
  projectController.getAllProjects
);

// find one project
router.get(
  "/projects/find/one/:project_id",
  userAuthenticate.handle,
  projectController.getProjectById
);

// delete a project
router.delete(
  "/projects/:project_id",
  userAuthenticate.handle,
  projectController.deleteProject
);

//!!!!!!!!!!! Team Routes
router.post(
  "/team/create",
  userAuthenticate.handle,
  validation.team.createTeam,
  teamController.createTeam
);

router.get("/team/all", userAuthenticate.handle, teamController.allTeam);

router.get(
  "/team/find/one/:team_id",
  userAuthenticate.handle,
  teamController.findOneTeam
);

router.get("/user/teams", userAuthenticate.handle, teamController.getMyTeams);

router.delete(
  "/teams/:team_id",
  userAuthenticate.handle,
  teamController.deleteTeam
);

router.put(
  "/invite/:team_id/user/:user_id",
  userAuthenticate.handle,
  teamController.inviteUserToTeam
);

module.exports = router;
