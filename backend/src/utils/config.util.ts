import * as Joi from 'joi';

export class ConfigUtil {
  static validate<T>(schema: Joi.ObjectSchema<T>): { readonly [key in keyof T]: unknown } {
    const { error, value: validatedValues } = schema.options({ stripUnknown: true }).validate(process.env);
    if (error) throw new Error(`Config validation error: ${error.message}.`);
    return validatedValues;
  }
}
