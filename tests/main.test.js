import chai from 'chai';
import chaiUrl from 'chai-url';
import {
  forEach, omit, get, clone
} from 'lodash';

chai.use(chaiUrl);

import {
  generateWithingsRequestURL,
  generateWithingsAuthorizeURL,
  generateWithingsTokenURL
} from '../src';

describe('# Withings ToolBox Tests Suite', () => {
  const callback = 'http://localhost';
  const token = 'sometoken';
  const secret = 'somesecret';
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
    cb: false,
    userid: '123'
  }], ({ name, method, path, cb, userid }) => {
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
          chai.expect(url).to.have.hostname('developer.health.nokia.com');
          chai.expect(url).to.contain.path(path);
          chai.expect(url).to.have.protocol('https');
        });
      });
    });
  });
});
