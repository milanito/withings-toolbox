import Joi from 'joi';
import Promise from 'bluebird';
import { merge } from 'lodash';

import {
  withingsOptionsSchema, callbackSchema,
  tokenSecretSchema, tokenSecretUserIdSchema
} from './config';

/**
 * This function validates an object with Joi
 * using the provided schema and resolves everything
 * wrapped with the provided options
 * @param { Object } options options to keep for next function
 * @param { Object } obj the object to validate
 * @param { Object } schema the schema to validate
 * @returns { Promise } A promise resolving the object as value field
 * wrapped with the options, rejects the error otherwise
 */
const _validator = (options, obj, schema) => new Promise((resolve, reject) =>
  Joi.validate(obj, schema, {
    presence: 'required'
  }, (err, value) => {
    if (err) {
      return reject(err);
    }
    return resolve(value);
  }))
  .then(value => merge(options, { value }));

/**
 * This function validates the options
 * @param { Object } options options to keep for next function
 * @returns { Promise } A promise resolving the object as value field
 * wrapped with the options, rejects the error otherwise
 */
export const validateOptions = options =>
  _validator(options, options, withingsOptionsSchema);

/**
 * This function validates the callback for the request call
 * @param { String } callback The callback to validate
 * @param { Object } options options to keep for next function
 * @returns { Promise } A promise resolving the object as value field
 * wrapped with the options, rejects the error otherwise
 */
export const validateCallback = (callback, options) =>
  _validator(options, { callback }, callbackSchema);

/**
 * This function validates the token and secret for the authorize call
 * @param { String } token The secret to validate
 * @param { String } secret The secret to validate
 * @param { Object } options options to keep for next function
 * @returns { Promise } A promise resolving the object as value field
 * wrapped with the options, rejects the error otherwise
 */
export const validateTokenSecret = (token, secret, options) =>
  _validator(options, { token, secret }, tokenSecretSchema);

/**
 * This function validates the token, secret and userid for the token call
 * @param { String } token The secret to validate
 * @param { String } secret The secret to validate
 * @param { String } userid The userid to validate
 * @param { Object } options options to keep for next function
 * @returns { Promise } A promise resolving the object as value field
 * wrapped with the options, rejects the error otherwise
 */
export const validateTokenSecretUserId = (token, secret, userid, options) =>
  _validator(options, { token, secret, userid }, tokenSecretUserIdSchema);
