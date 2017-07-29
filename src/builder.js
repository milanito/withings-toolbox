import buildUrl from 'build-url';
import { escape } from 'querystring';
import crypto from 'crypto';
import {
  join, merge,
  get, reduce, keys
} from 'lodash';

/**
 * This function will generate the URL to request
 * withings API
 * @param { Object } urlOptions The URL's options, depending on
 * which call you are making
 * @param { String } host The URL's host
 * @param { String } signingKey The string used to sign the request
 * @returns { String } A withings compliant URL
 */
export default (urlOptions, host, signingKey) => {
  const baseString = join([
    'GET',
    escape(buildUrl(host)),
    escape(join(reduce(keys(get(urlOptions, 'queryParams', {})).sort(), (total, key) => {
      total.push(join([key, get(urlOptions.queryParams, key, '')], '='));
      return total;
    }, []), '&'))
  ], '&');
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64');
  const finalOptions = merge(urlOptions, {
    queryParams: {
      oauth_signature: escape(signature)
    }
  });
  return join([
    host,
    join(reduce(keys(get(finalOptions, 'queryParams', {})).sort(), (total, key) => {
      total.push(join([key, get(finalOptions.queryParams, key, '')], '='));
      return total;
    }, []), '&')
  ], '?');
};
