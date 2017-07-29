import moment from 'moment';
import { escape } from 'querystring';
import { generate } from 'randomstring';
import {
  join, merge,
  map, clone
} from 'lodash';

import builder from './builder';
import errorsHandler from './errors';
import {
  validateOptions, validateCallback,
  validateTokenSecret, validateTokenSecretUserId
} from './validator';
import {
  withingsRequestTokenURL,
  withingsAuthorizeURL,
  withingsGenerateTokenURL,
  withingsMeasureURL,
  withingsSignatureMethod,
  withingsOauthVersion
} from './config';

/**
 * This function generates a new build url object
 * @param { String } oauthConsumerKey The consumer key
 * @returns { Object } A valid build-url object
 */
const generateDefaultBuildObject = oauthConsumerKey => clone({
  path: '',
  queryParams: {
    oauth_consumer_key: oauthConsumerKey,
    oauth_nonce: generate(),
    oauth_signature_method: withingsSignatureMethod,
    oauth_timestamp: moment().unix(),
    oauth_version: withingsOauthVersion,
  }
});

/**
 * This function generated the URL to request mesure for a user
 * @param { String } token The request token
 * @param { String } secret The request secret
 * @param { String } oauthConsumerKey The consumer key
 * @param { String } oauthConsumerSecret The consumer secret
 * @returns { String } the URL to request
 */
const _generateWithingsMeasureURL = (token, secret, oauthConsumerKey, oauthConsumerSecret) =>
  builder(merge(generateDefaultBuildObject(oauthConsumerKey), {
    queryParams: {
      oauth_token: token,
    }
  }), withingsMeasureURL, join(map([oauthConsumerSecret, secret], it => escape(it)), '&'));

/**
 * This function generated the URL to retrieve the user
 * token
 * @param { String } token The authorization token
 * @param { String } secret The authorization secret
 * @param { String } userid The userid
 * @param { String } oauthConsumerKey The consumer key
 * @param { String } oauthConsumerSecret The consumer secret
 * @returns { String } the URL to request
 */
const _generateWithingsTokenURL = (token, secret, userid, oauthConsumerKey, oauthConsumerSecret) =>
  builder(merge(generateDefaultBuildObject(oauthConsumerKey), {
    queryParams: {
      oauth_token: token,
      userid
    }
  }), withingsGenerateTokenURL, join(map([oauthConsumerSecret, secret], it => escape(it)), '&'));

/**
 * This function generated the URL to authorize the user
 * @param { String } token The request token
 * @param { String } secret The request secret
 * @param { String } oauthConsumerKey The consumer key
 * @param { String } oauthConsumerSecret The consumer secret
 * @returns { String } the URL to request
 */
const _generateWithingsAuthorizeURL = (token, secret, oauthConsumerKey, oauthConsumerSecret) =>
  builder(merge(generateDefaultBuildObject(oauthConsumerKey), {
    queryParams: {
      oauth_token: token,
    }
  }), withingsAuthorizeURL, join(map([oauthConsumerSecret, secret], it => escape(it)), '&'));

/**
 * This function generated the URL to retrieve the user
 * authorization token and secret
 * @param { String } callback The authorization callback
 * @param { String } oauthConsumerKey The consumer key
 * @param { String } oauthConsumerSecret The consumer secret
 * @returns { String } the URL to request
 */
const _generateWithingsRequestURL = ({ callback }, oauthConsumerKey, oauthConsumerSecret) =>
  builder(merge(generateDefaultBuildObject(oauthConsumerKey), {
    queryParams: {
      oauth_callback: escape(callback),
    }
  }), withingsRequestTokenURL, `${escape(oauthConsumerSecret)}&`);

/**
 * This function generated the URL to retrieve the user
 * authorization token and secret
 * @param { String } callback The authorization callback
 * @param { Object } options The options object
 * @returns { String } the URL to request
 */
export const generateWithingsRequestURL = (callback, options) =>
  validateOptions(clone(options))
    .then(opts => validateCallback(callback, opts))
    .then(({ value, oauthConsumerKey, oauthConsumerSecret }) => new Promise(resolve =>
      resolve(_generateWithingsRequestURL(value, oauthConsumerKey, oauthConsumerSecret))))
    .catch(errorsHandler);

/**
 * This function generated the URL to retrieve the user
 * authorization token and secret
 * @param { String } token The request token
 * @param { String } secret The request secret
 * @param { Object } options The options object
 * @returns { String } the URL to request
 */
export const generateWithingsAuthorizeURL = (token, secret, options) =>
  validateOptions(clone(options))
    .then(opts => validateTokenSecret(token, secret, opts))
    .then(({ value, oauthConsumerKey, oauthConsumerSecret }) => new Promise(resolve =>
      resolve(_generateWithingsAuthorizeURL(value.token, value.secret,
        oauthConsumerKey, oauthConsumerSecret))))
    .catch(errorsHandler);

/**
 * This function generated the URL to retrieve the user
 * authorization token and secret
 * @param { String } token The authorization token
 * @param { String } secret The authorization secret
 * @param { String } userid The user id
 * @param { Object } options The options object
 * @returns { String } the URL to request
 */
export const generateWithingsTokenURL = (token, secret, userid, options) =>
  validateOptions(clone(options))
    .then(opts => validateTokenSecretUserId(token, secret, userid, opts))
    .then(({ value, oauthConsumerKey, oauthConsumerSecret }) => new Promise(resolve =>
      resolve(_generateWithingsTokenURL(value.token, value.secret, value.userid,
        oauthConsumerKey, oauthConsumerSecret))))
    .catch(errorsHandler);

/**
 * This function generated the URL to retrieve the user
 * mesure
 * @param { String } token The user token
 * @param { String } secret The user secret
 * @param { Object } options The options object
 * @returns { String } the URL to request
 */
export const generateWithingsMeasureURL = (token, secret, options) =>
  validateOptions(clone(options))
    .then(opts => validateTokenSecret(token, secret, opts))
    .then(({ value, oauthConsumerKey, oauthConsumerSecret }) => new Promise(resolve =>
      resolve(_generateWithingsMeasureURL(value.token, value.secret,
        oauthConsumerKey, oauthConsumerSecret))))
    .catch(errorsHandler);
