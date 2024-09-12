const Joi = require("joi");

exports.adminValidation = (data) => {
  const Admin = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.empty": `"name" cannot be an empty field`,
      "any.required": `"name" is a required field`,
    }),
    email: Joi.string().email().max(50).lowercase().required().messages({
      "string.empty": `"email" cannot be an empty field`,
      "any.required": `"email" is a required field`,
    }),
    password: Joi.string()
      .pattern(new RegExp(`^[a-zA-Z0-9!@#$]{6,30}$`))
      .required()
      .messages({
        "string.pattern.base": `"password" must be between 6 to 30 characters and can contain letters, numbers, and special characters !@#$`,
        "string.empty": `"password" cannot be an empty field`,
        "any.required": `"password" is a required field`,
      }),
    phone: Joi.string()
      .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/)
      .required()
      .messages({
        "string.empty": `"phone" cannot be an empty field`,
        "string.pattern.base": `"phone" must match the format XX-XXX-XX-XX`,
        "any.required": `"phone" is a required field`,
      }),
    info: Joi.string().optional().allow(null, "").messages({
      "string.empty": `"info" cannot be an empty field`,
    }),
    photo: Joi.string().optional().allow(null, "").messages({
      "string.empty": `"photo" cannot be an empty field`,
    }),
    is_active: Joi.boolean().optional(),
    is_creator: Joi.boolean().optional(),
    created_date: Joi.date().optional(),
    updated_date: Joi.date().optional(),
    token: Joi.string().optional(),
  });

  return Admin.validate(data, { abortEarly: false });
};
