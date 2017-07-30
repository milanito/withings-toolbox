import chai from 'chai';
import chaiUrl from 'chai-url';
import {
  forEach, omit, get, clone
} from 'lodash';

import {
  generateWithingsRequestURL,
  generateWithingsAuthorizeURL,
  generateWithingsTokenURL,
  generateWithingsMeasureBodyURL,
  generateWithingsMeasureActivityURL,
  generateWithingsSleepSummaryURL,
} from '../src';

chai.use(chaiUrl);

describe('# Withings ToolBox Tests Suite', () => {
  const callback = 'http://localhost';
  const token = 'test';
  const secret = 'test';
  const options = {
    oauthConsumerKey: 'test',
    oauthConsumerSecret: 'test',
  };

  forEach([{
    name: 'generateWithingsRequestURL',
    method: generateWithingsRequestURL,
    path: '/account/request_token',
    cb: true
  }, {
    name: 'generateWithingsAuthorizeURL',
    method: generateWithingsAuthorizeURL,
    path: '/account/authorize',
    cb: false
  }, {
    name: 'generateWithingsTokenURL',
    method: generateWithingsTokenURL,
    path: '/account/access_token',
    cb: false
  }, {
    name: 'generateWithingsMeasureBodyURL',
    method: generateWithingsMeasureBodyURL,
    path: '/measure',
    cb: false,
    userid: '136',
    http: true
  }, {
    name: 'generateWithingsMeasureActivityURL',
    method: generateWithingsMeasureActivityURL,
    path: '/measure',
    cb: false,
    userid: '136'
  }, {
    name: 'generateWithingsSleepSummaryURL',
    method: generateWithingsSleepSummaryURL,
    path: '/sleep',
    cb: false,
    userid: '136'
  }], ({ name, method, path, cb, userid, http }) => {
    describe(`## ${name} method`, () => {
      it('should fail with no options', () => {
        let call;
        if (cb) {
          call = method(callback);
        } else if (userid) {
          call = method(token, secret, userid);
        } else {
          call = method(token, secret);
        }
        return call
          .catch((err) => {
            chai.expect(err).not.to.be.undefined;
            chai.expect(err).to.have.property('message')
            .that.is.equal('"value" is required');
          });
      });

      forEach(['oauthConsumerKey', 'oauthConsumerSecret'], key =>
        it(`should fail with no ${key} key in options`, () => {
          let call;
          if (cb) {
            call = method(callback, omit(clone(options), [key]));
          } else if (userid) {
            call = method(token, secret, userid, omit(clone(options), [key]));
          } else {
            call = method(token, secret, omit(clone(options), [key]));
          }
          return call
            .catch((err) => {
              chai.expect(err).not.to.be.undefined;
              chai.expect(err).to.have.property('message')
              .that.is.equal(`"${key}" is required`);
            });
        }));

      if (cb) {
        it('should fail with wrong callback', () => {
          return method('qsdfsqfsfq', clone(options))
          .catch((err) => {
            chai.expect(err).not.to.be.undefined;
            chai.expect(err).to.have.property('message')
            .that.is.equal('"callback" must be a valid uri with a scheme matching the http|https pattern');
          });
        });
      } else {
        it('should fail with empty token', () => {
          let call;
          if (userid) {
            call = method('', secret, userid, clone(options));
          } else {
            call = method('', secret, clone(options));
          }
          return call
            .catch((err) => {
              chai.expect(err).not.to.be.undefined;
              chai.expect(err).to.have.property('message')
              .that.is.equal('"token" is not allowed to be empty');
            });
        });

        it('should fail with empty secret', () => {
          let call;
          if (userid) {
            call = method(token, '', userid, clone(options));
          } else {
            call = method(token, '', clone(options));
          }
          return call
            .catch((err) => {
              chai.expect(err).not.to.be.undefined;
              chai.expect(err).to.have.property('message')
              .that.is.equal('"secret" is not allowed to be empty');
            });
        });

        if (userid) {
          it('should fail with empty userid', () => {
            return method(token, secret, '', clone(options))
              .catch((err) => {
                chai.expect(err).not.to.be.undefined;
                chai.expect(err).to.have.property('message')
                .that.is.equal('"userid" is not allowed to be empty');
              });
          });
        }
      }

      it(`should generate the ${path} URL`, () => {
        let call;
        if (cb) {
          call = method(callback, clone(options));
        } else if (userid) {
          call = method(token, secret, userid, clone(options));
        } else {
          call = method(token, secret, clone(options));
        }
        return call
          .then((url) => {
            chai.expect(url).to.contain.hostname('health.nokia.com');
            chai.expect(url).to.contain.path(path);
            if (http) {
              chai.expect(url).to.have.protocol('http');
            } else {
              chai.expect(url).to.have.protocol('https');
            }
          });
      });
    });
  });
});
