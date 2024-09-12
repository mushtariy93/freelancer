const Joi =require("joi");

exports.clientValidation=(data)=>{
    const Client = Joi.object({
      name: Joi.string().min(3).max(100).required().messages({
        "string.empty": `"name" cannot be an empty field`,
        "any.required": `"name" is a required field`,
      }),
      email: Joi.string().email().max(50).lowercase().required().messages({
        "string.empty": `"email" cannot be an empty field`,
        "any.required": `"email" is a required field`,
      }),
      password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9!@#$]{6,30}$`)).messages({
        "string.pattern.base": `"password" must be between 6 to 30 characters and can contain letters, numbers, and special characters !@#$`,
        "string.empty": `"password" cannot be an empty field`,
        "any.required": `"password" is a required field`,
      }),
      phone_number: Joi.string()
        .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/)
        .messages({
          "string.empty": `"phone_number" cannot be an empty field`,
        }),
      company_name: Joi.string().max(50).required().messages({
        "string.empty": `"company_name" cannot be an empty field`,
        "any.required": `"company_name" is a required field`,
      }),
      is_active: Joi.boolean().optional(),
      token:Joi.string(),
    });


    return Client.validate(data,{abortEarly:false});
};




