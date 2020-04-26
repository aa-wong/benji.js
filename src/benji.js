'use strict';

import BenjiRequestMethod from './benji-request-method';

const BenjiSession = (xhr, method, url, headers, body) => {
  return new Promise((resolve, reject) => {
    if (!(method in BenjiRequestMethod)) {
      return reject(new Error('Invalid method supplied.'));
    }
    const successCode = !body ? BenjiRequestMethod._.successCodes[method] : BenjiRequestMethod._.createSuccess[method];

    xhr.open(method || BenjiRequestMethod.GET, url, true);
    if (headers && headers.constructor === Object) {
      for (let key in headers) {
        if (headers.hasOwnProperty(key)) xhr.setRequestHeader(key, headers[key]);
      }
    };

    if (body !== undefined && body !== null) {
      if (headers['Content-Type'] === 'application/x-www-form-urlencoded' && typeof body !== 'string') {
        return reject(new Error('Invalid body format.'));
      } else if (headers['Content-Type'] === 'application/json') {
        if (body.constructor === Object || Array.isArray(body)) body = JSON.stringify(body);
        else if (typeof body !== 'string') {
          return reject(new Error('Invalid body format.'));
        }
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        let res;

        try {
          res = JSON.parse(xhr.response);
        } catch (e) {
          return reject(e);
        }

        if (xhr.status === successCode) return resolve(res);
        if (res) return reject(res);
        return reject(xhr.statusText);
      }
    };

    xhr.ontimeout = () => {
      return reject(new Error('Request timed out'));
    };

    xhr.onerror = () => {
      return reject(new Error('Request Failed'));
    };

    xhr.send(body);
  });
};

class Benji {

  /**
   * Constructor Method
   * @param {Object} config options to apply on initialization
   */
  constructor(options = {}) {
    this._ = {};
    Object.keys(options).forEach(prop => this._[prop] = options[prop]);
    this._callbacks = {};
  }

  /**
   * PROPERTIES
   */

  /**
   * Base URL Getter
   * @return {String} baseURL string
   */
  get baseURL() {
    return this._.baseURL !== undefined ? this._.baseURL : '';
  }

  /**
   * Base URL Setter
   * @param  {String} url string argument to set as baseURL property
   */
  set baseURL(url) {
    if (url && url.constructor === String) this._.baseURL = url;
  }

  /**
   * Base Headers Getter
   * @return {{String : Sting}} baseHeaders object
   */
  get baseHeaders() {
    return this._.baseHeaders !== undefined ? this._.baseHeaders : {};
  }

  /**
   * Base Headers Setter
   * @param  {{String : Sting}} headers object argument to set as baseHeaders property
   */
  set baseHeaders(headers) {
    if (headers && headers.constructor === Object) this._.baseHeaders = headers;
    else this._.baseHeaders = this.baseHeaders !== undefined ? this.baseHeaders : {};
  }

  /**
   * XMLHttpRequest Getter
   * @return {XMLHttpRequest} XMLHttpRequest object to handle all HTTP request calls
   */
  get xhr() {
    if (!this._.xhr) this._.xhr = new XMLHttpRequest();
    return this._.xhr;
  }

  /**
   * XMLHttpRequest Setter
   * @param  {XMLHttpRequest} xhr XMLHttpRequest object to set as xhr property
   */
  set xhr(xhr) {
    if (xhr && xhr.constructor === XMLHttpRequest) this._.xhr = xhr;
  }

  /**
   * REQUEST METHODS
   */

  /**
   * GET requester method
   * @param  {String}             path    URI string to append to baseURL.
   * @param  {{String : Sting}}   headers headers to append the baseHeaders
   * @return {Promise}            promise object to be fulfilled in request
   */
  async GET(path, headers) {
    return this.FETCH(BenjiRequestMethod.GET, path, headers);
  }

  /**
   * POST requester method
   * @param  {String}             path    URI string to append to baseURL.
   * @param  {{String : Sting}}   headers headers to append the baseHeaders
   * @param  {Any}                body    body to send in request
   * @return {Promise}                    promise object to be fulfilled in request
   */
  async POST(path, headers, body) {
    return this.FETCH(BenjiRequestMethod.POST, path, headers, body);
  }

  /**
   * PUT requester method
   * @param  {String}             path    URI string to append to baseURL.
   * @param  {{String : Sting}}   headers headers to append the baseHeaders
   * @param  {Any}                body    body to send in request
   * @return {Promise}                    promise object to be fulfilled in request
   */
  async PUT(path, headers, body) {
    return this.FETCH(BenjiRequestMethod.PUT, path, headers, body);
  }

  /**
   * PATCH requester method
   * @param  {String}             path    URI string to append to baseURL.
   * @param  {{String : Sting}}   headers headers to append the baseHeaders
   * @param  {Any}                body    body to send in request
   * @return {Promise}                    promise object to be fulfilled in request
   */
  async PATCH(path, headers, body) {
    return this.FETCH(BenjiRequestMethod.PATCH, path, headers, body);
  }

  /**
   * DELETE requester method
   * @param  {String}             path    URI string to append to baseURL.
   * @param  {{String : Sting}}   headers headers to append the baseHeaders
   * @return {Promise}                    promise object to be fulfilled in request
   */
  async DELETE(path, headers) {
    return this.FETCH(BenjiRequestMethod.DELETE, path, headers);
  }

  /**
   * FETCH requester method
   * @param  {BenjiRequestMethod} method  Request Method Definition BenjiRequestMethod
   * @param  {String}             path    URI string to append to baseURL.
   * @param  {{String : Sting}}   headers headers to append the baseHeaders
   * @param  {Any}                body    body to send in request
   * @return {Promise}                    promise object to be fulfilled in request
   */
  async FETCH(method, path, headers, body) {
    const url = `${this.baseURL}${path}`;

    if (headers) this.baseHeaders = Object.assign(this.baseHeaders, headers);
    const res = await BenjiSession(this.xhr, method, url, this.baseHeaders, body)
      .catch(e => {
        this._handleError(e);
        return Promise.reject(e);
      });

    this._handleSuccess(res);
    return Promise.resolve(res);
  }

  /**
   * EVENT HANDLER METHODS
   */

  /**
   * [onError description]
   * @param  {Function} cb  Callback function that executes on request calls error
   * @return {Benji}        Current Benji Object
   */
  onError(cb) {
    return this._applyCallback('onError', cb);
  }

  /**
   * [onSuccess description]
   * @param  {Function} cb  Callback function that executes on request calls successes
   * @return {Benji}        Current Benji Object
   */
  onSuccess(cb) {
    return this._applyCallback('onSuccess', cb);
  }

  /**
   * Internal Methods
   */
  _applyCallback(key, cb) {
    if (typeof cb !== 'function') console.warn(`${key} :: requires a function callback`);
    else this._callbacks[key] = e => cb(e);
    return this;
  }

  _handleError(e) {
    const cb = this._callbacks['onError'];

    if (cb) cb(e);
  }

  _handleSuccess(e) {
    const cb = this._callbacks['onSuccess'];

    if (cb) cb(e);
  }
}

export default {
  Benji: Benji,
  BenjiMethods: BenjiRequestMethod
};
