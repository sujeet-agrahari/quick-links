import * as Joi from '@hapi/joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('production', 'development', 'test')
    .required()
    .messages({
      'any.required': 'NODE_ENV must be provided',
      'any.only':
        'The acceptable values for NODE_ENV are production, development, or test.',
    }),
});
