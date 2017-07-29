import Joi from 'joi';
import { join, clone } from 'lodash';

const constructWithingsURL = path => join([
  'https://developer.health.nokia.com/account', path
], '/');

export const withingsOptionsSchema = Joi.object().keys({
  oauthConsumerKey: Joi.string().required(),
  oauthConsumerSecret: Joi.string().required(),
});

export const callbackSchema = Joi.object().keys({
  callback: Joi.string().uri({
    scheme: ['http', 'https']
  }).required()
});

export const tokenSecretSchema = Joi.object().keys({
  token: Joi.string().required(),
  secret: Joi.string().required()
});

export const tokenSecretUserIdSchema = clone(tokenSecretSchema).keys({
  userid: Joi.string().required()
});

export const withingsRequestTokenURL = constructWithingsURL('request_token');

export const withingsAuthorizeURL = constructWithingsURL('authorize');

export const withingsGenerateTokenURL = constructWithingsURL('access_token');

export const withingsSignatureMethod = 'HMAC-SHA1';

export const withingsOauthVersion = '1.0';
