'use strict';

import BenjiRequestType from './benji-request-type';

const BenjiSession = (xhr, method, url, headers, body) => {
  return new Promise((resolve, reject) => {
    if (!(method in BenjiRequestType)) {
      return reject(new Error('Invalid method supplied.'));
    }
    const successCode = !body ? BenjiRequestType._.successCodes[method] : BenjiRequestType._.createSuccess[method];

    xhr.open(method || BenjiRequestType.GET, url, true);
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
  constructor(options = {}) {
    this._ = {};
    Object.keys(options).forEach(prop => this._[prop] = options[prop]);
    this._callbacks = {};
  }

  get baseURL() {
    return this._.baseURL !== undefined ? this._.baseURL : '';
  }

  set baseURL(url) {
    if (url && url.constructor === String) this._.baseURL = url;
  }

  get baseHeaders() {
    return this._.baseHeaders !== undefined ? this._.baseHeaders : {};
  }

  get xhr() {
    if (!this._xhr) this._xhr = new XMLHttpRequest();
    return this._xhr;
  }

  set xhr(xhr) {
    if (xhr && xhr.constructor === XMLHttpRequest) this._xhr = xhr;
  }

  set baseHeaders(headers) {
    if (headers && headers.constructor === Object) this._.baseHeaders = headers;
    else this._.baseHeaders = this.baseHeaders !== undefined ? this.baseHeaders : {};
  }

  async GET(path, headers) {
    return this.FETCH(BenjiRequestType.GET, path, headers);
  }

  async POST(path, headers, body) {
    return this.FETCH(BenjiRequestType.POST, path, headers, body);
  }

  async PUT(path, headers, body) {
    return this.FETCH(BenjiRequestType.PUT, path, headers, body);
  }

  async PATCH(path, headers, body) {
    return this.FETCH(BenjiRequestType.PATCH, path, headers, body);
  }

  async DELETE(path, headers) {
    return this.FETCH(BenjiRequestType.DELETE, path, headers);
  }

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

  onError(cb) {
    this._applyCallback('onError', cb);
    return this;
  }

  onSuccess(cb) {
    this._applyCallback('onSuccess', cb);
    return this;
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
  benjiMethod: BenjiRequestType
};
