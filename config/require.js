const Joi = require("joi");
const ValidateEmail = function(values) {
  const Schema = {
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required()
  };
  return Joi.validate(values, Schema);
};
exports.ValidateEmail = ValidateEmail;
