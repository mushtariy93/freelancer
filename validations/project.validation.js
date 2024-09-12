const Joi = require("joi");

const projectValidation = (data) => {
  const schema = Joi.object({
    clientId: Joi.number().integer().required(),
    title: Joi.string().max(100).required(),
    description: Joi.string().optional(),
    budget: Joi.number().precision(2).required(),
    deadline: Joi.date().required(),
    status: Joi.string().max(50).required(),
    is_active: Joi.boolean().optional(),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = { projectValidation };
