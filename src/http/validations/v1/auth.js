const Joi = require("joi");

const registerValidation = async (req, res, next) => {
  try {
    let schema = Joi.object({
      userName: Joi.string().required().max(255).messages({
        "string.base": `نام کاربری باید از نوع رشته ای باشد`,
        "string.empty": `نام کاربری نمی تواند خالی بماند`,
        "string.max": `نام کاربری نمی تواند بیشتر از 255 حرف باشد`,
        "any.required": `فیلد نام کاربری الزامی است`,
      }),
      email: Joi.string().email().required().max(255).messages({
        "string.base": `ایمیل باید از نوع رشته ای باشد`,
        "string.empty": `ایمیل نمی تواند خالی بماند`,
        "string.email": "فرمت ایمیل معتبر نیست",
        "string.max": `ایمیل نمی تواند بیشتر از 255 حرف باشد`,
        "any.required": `فیلد ایمیل الزامی است`,
      }),
      mobile: Joi.string()
        .required()
        .regex(
          /(0|\+98)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/
        )
        .length(11)
        .messages({
          "string.base": `شماره موبایل باید از نوع رشته ای باشد`,
          "string.empty": `شماره موبایل نمی تواند خالی بماند`,
          "string.length": `شماره موبایل باید 11 رقم باشد`,
          "string.pattern.base": "فرمت شماره تلفن معتبر نیست",
          "object.regex": "فرمت شماره تلفن معتبر نیست",
          "any.required": `فیلد شماره موبایل الزامی است`,
        }),
      password: Joi.string().required().min(8).max(50).messages({
        "string.base": `رمز عبور باید از نوع رشته ای باشد`,
        "string.empty": `رمز عبور نمی تواند خالی بماند`,
        "string.min": "رمز عبور نباید کمتر از 8 حرف باشد",
        "string.max": `رمز عبور نمی تواند بیشتر از 50 حرف باشد`,
        "any.required": `فیلد رمز عبور الزامی است`,
      }),
      passwordConfirmation: Joi.string()
        .required()
        .min(8)
        .max(50)
        .equal(Joi.ref("password"))
        .messages({
          "string.base": `تاییدیه رمز عبور باید از نوع رشته ای باشد`,
          "string.empty": `تاییدیه رمز عبور نمی تواند خالی بماند`,
          "string.min": "تاییدیه رمز عبور نباید کمتر از 8 حرف باشد",
          "string.max": `تاییدیه رمز عبور نمی تواند بیشتر از 50 حرف باشد`,
          "any.required": `فیلد تاییدیه رمز عبور الزامی است`,
          "any.only": "تاییدیه رمز عبور با رمز عبور تطابق ندارد",
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

const loginValidation = async (req, res, next) => {
  try {
    let schema = Joi.object({
      payload: Joi.string().required().messages({
        "string.base": `موبایل یا ایمیل باید از نوع رشته ای باشد`,
        "string.empty": `موبایل یا ایمیل نمی تواند خالی بماند`,
        "any.required": `فیلد موبایل یا ایمیل الزامی است`,
      }),
      password: Joi.string().required().min(8).max(50).messages({
        "string.base": `رمز عبور باید از نوع رشته ای باشد`,
        "string.empty": `رمز عبور نمی تواند خالی بماند`,
        "string.min": "رمز عبور نباید کمتر از 8 حرف باشد",
        "string.max": `رمز عبور نمی تواند بیشتر از 50 حرف باشد`,
        "any.required": `فیلد رمز عبور الزامی است`,
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
  registerValidation,
  loginValidation,
};
