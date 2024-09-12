const Joi = require("joi");

const contractValidation = (data) => {
  const schema = Joi.object({
    freelancer_id: Joi.number().integer().required(),
    project_id: Joi.number().integer().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().optional(),
    status: Joi.string().max(50).required(),
  });
  return schema.validate(data);
};

module.exports = { contractValidation };
