import Joi from 'joi';

const NotePayloadSchema = Joi.object({
  title: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  body: Joi.string().required(),
});

export default NotePayloadSchema;
