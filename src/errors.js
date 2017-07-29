import Promise from 'bluebird';
import {
  get, first,
} from 'lodash';

/**
 * This function handles rightly any error happening
 * for Joi. If any other error, it simply rejects it
 * to be catch next
 * @param { Object } error The error object
 * @returns { Promise } rejects the error
 */
export default error => new Promise((resolve, reject) => {
  if (get(error, 'isJoi', false)) {
    return reject(new Error(get(first(get(error, 'details', [])),
      'message', 'undefinedJoiError')));
  }
  return reject(error);
});
