const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/afiv',
      'image/apng',
      'image/gif',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/svg+xml',
      'image/webp'
    )
    .required(),
}).unknown();

module.exports = ImageHeadersSchema;
