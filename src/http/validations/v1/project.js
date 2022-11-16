const Joi = require('joi');

const createNewProject = async (req, res, next) => {
  try {
        let schema = Joi.object({
          title: Joi.string().required().max(255).messages({
            "string.base": `عنوان پروژه باید از نوع رشته ای باشد`,
            "string.empty": `عنوان پروژه نمی تواند خالی بماند`,
            "string.max": `عنوان پروژه نمی تواند بیشتر از 255 حرف باشد`,
            "any.required": `فیلد عنوان پروژه الزامی است`,
          }),
          text: Joi.string().required().messages({
            "string.base": `متن پروژه باید از نوع رشته ای باشد`,
            "string.empty": `متن پروژه نمی تواند خالی بماند`,
            "any.required": `فیلد متن پروژه الزامی است`,
          }),
          isPrivate: Joi.boolean().messages({
            'boolean.base':"فرمت فیلد معتبر نیست"
          }),
          tags: Joi.array().items(Joi.string().max(255)).messages({
            "array.base": "فیلد تگ ها باید از نوع ارایه ای باشد",
            "string.base": "ایتم های تگ ها باید از نوع رشته ای باشد",
            'string.max': 'هر کدام از تگ ها نمی تواند بیشتر از 255 شناسه باشد'
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
    createNewProject,
}