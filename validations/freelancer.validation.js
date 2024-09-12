const Joi = require("joi");

exports.freelancerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.empty": `"name" cannot be empty`,
      "any.required": `"name" is required`,
    }),
    email: Joi.string().email().max(50).lowercase().required().messages({
      "string.empty": `"email" cannot be empty`,
      "any.required": `"email" is required`,
    }),
    password: Joi.string().min(6).max(30).required().messages({
      "string.empty": `"password" cannot be empty`,
      "any.required": `"password" is required`,
    }),
    phone: Joi.string()
      .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/)
      .required()
      .messages({
        "string.empty": `"phone" cannot be empty`,
        "string.pattern.base": `"phone" must be in the format XX-XXX-XX-XX`,
        "any.required": `"phone" is required`,
      }),
    experience: Joi.number().integer().min(0).required().messages({
      "number.base": `"experience" must be a number`,
      "number.integer": `"experience" must be an integer`,
      "any.required": `"experience" is required`,
    }),
    rating: Joi.number().min(0).max(5).optional().messages({
      "number.base": `"rating" must be a number`,
      "number.min": `"rating" must be at least 0`,
      "number.max": `"rating" must be less than or equal to 5`,
    }),
    active_link: Joi.string().optional(),
    is_active: Joi.boolean().optional(),
  });

  return schema.validate(data, { abortEarly: false });
};
