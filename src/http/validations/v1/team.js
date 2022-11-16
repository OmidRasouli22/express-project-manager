const Joi = require('joi');

const createTeam = async (req, res, next) => {
  try {
    let schema = Joi.object({
      name: Joi.string().required().max(255).messages({
        "string.base": `نام تیم باید از نوع رشته ای باشد`,
        "string.empty": `نام تیم نمی تواند خالی بماند`,
        "string.max": `نام تیم نمی تواند بیشتر از 255 حرف باشد`,
        "any.required": `فیلد نام تیم الزامی است`,
      }),
      userName: Joi.string().required().max(255).messages({
        "string.base": `یوزرنیم تیم باید از نوع رشته ای باشد`,
        "string.empty": `یوزرنیم تیم نمی تواند خالی بماند`,
        "string.max": `یوزرنیم تیم نمی تواند بیشتر از 255 حرف باشد`,
        "any.required": `فیلد یوزرنیم تیم الزامی است`,
      }),
      description: Joi.string().required().messages({
        "string.base": `توضیحات تیم باید از نوع رشته ای باشد`,
        "string.empty": `توضیحات تیم نمی تواند خالی بماند`,
        "any.required": `فیلد توضیحات تیم الزامی است`,
      }),
    }).options({ stripUnknown: true });

    let validationResult = await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    req.body = { ...req.body, ...validationResult };
    return next();
  } catch (error) {
    let errors = [];
    errors = error.details.map((err) => err.message);
    return res.status(400).json({ errors });
  }
};

module.exports = {
  createTeam,
};
