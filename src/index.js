const Method = Object.freeze({
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  _: {
    successCodes: {
      GET: 200,
      POST: 200,
      PUT: 200,
      PATCH: 200,
      DELETE: 200
    },
    createSuccess: {
      POST: 201,
      PUT: 201,
      PATCH: 201
    }
  }
});

const httpSession = (xhr, request) => {
  let { method, url, headers, body } = request;

  if (!(method in Method)) {
    return Promise.reject(new Error('Invalid method supplied.'));
  }
  const successCode = !body ? Method._.successCodes[method] : Method._.createSuccess[method];

  xhr.open(method || Method.GET, url, true);
  if (headers && headers.constructor === Object) {
    for (let key in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, key)) {
        xhr.setRequestHeader(key, headers[key]);
      }
    }
  }

  if (body) {
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded' && typeof body !== 'string') {
      return Promise.reject(new Error('Invalid body format.'));
    } else if (headers['Content-Type'] === 'application/json') {
      if (body.constructor === Object || Array.isArray(body)) {
        body = JSON.stringify(body);
      } else if (typeof body !== 'string') {
        return Promise.reject(new Error('Invalid body format.'));
      }
    }
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      let res;

      try {
        res = JSON.parse(xhr.response);
      } catch (e) {
        return Promise.reject(e);
      }

      if (xhr.status === successCode) {
        return Promise.resolve(res);
      }

      if (res) {
        return Promise.reject(res);
      }

      return Promise.reject(xhr.statusText);
    }
  };

  xhr.send(body);
};

class Http {
  /**
   * Constructor Method
   * @param {Object} options options to apply on initialization
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
    return !this._.baseURL ? '' : this._.baseURL;
  }

  /**
   * Base URL Setter
   * @param  {String} url string argument to set as baseURL property
   */
  set baseURL(url) {
    if (url && url.constructor === String) {
      this._.baseURL = url;
    }
  }

  /**
   * Base Headers Getter
   * @return {{String : Sting}} baseHeaders object
   */
  get baseHeaders() {
    return !this._.baseHeaders ? {} : this._.baseHeaders;
  }

  /**
   * Base Headers Setter
   * @param  {{String : Sting}} headers object argument to set as baseHeaders property
   */
  set baseHeaders(headers) {
    if (headers && headers.constructor === Object) {
      this._.baseHeaders = headers;
    } else {
      this._.baseHeaders = !this.baseHeaders ? {} : this.baseHeaders;
    }
  }

  /**
   * XMLHttpRequest Getter
   * @return {XMLHttpRequest} XMLHttpRequest object to handle all HTTP request calls
   */
  get xhr() {
    if (!this._.xhr) {
      this._.xhr = new XMLHttpRequest();
    }
    return this._.xhr;
  }

  /**
   * XMLHttpRequest Setter
   * @param  {XMLHttpRequest} xhr XMLHttpRequest object to set as xhr property
   */
  set xhr(xhr) {
    if (xhr && xhr.constructor === XMLHttpRequest) {
      this._.xhr = xhr;
    }
  }

  /**
   * REQUEST METHODS
   */

  /**
   * GET requester method
   * @param  {String}             url     URI string to append to baseURL.
   * @param  {{String : Sting}}   headers headers to append the baseHeaders
   * @return {Promise}            promise object to be fulfilled in request
   */
  get(url, headers) {
    return this.fetch({
      method: Method.GET,
      url: url,
      headers: headers
    });
  }

  /**
   * POST requester method
   * @param  {String}             url     URI string to append to baseURL.
   * @param  {{String : Sting}}   headers headers to append the baseHeaders
   * @param  {Any}                body    body to send in request
   * @return {Promise}                    promise object to be fulfilled in request
   */
  post(url, headers, body) {
    return this.fetch({
      method: Method.POST,
      url: url,
      headers: headers,
      body: body
    });
  }

  /**
   * PUT requester method
   * @param  {String}             url     URI string to append to baseURL.
   * @param  {{String : Sting}}   headers headers to append the baseHeaders
   * @param  {Any}                body    body to send in request
   * @return {Promise}                    promise object to be fulfilled in request
   */
  put(url, headers, body) {
    return this.fetch({
      method: Method.PUT,
      url: url,
      headers: headers,
      body: body
    });
  }

  /**
   * PATCH requester method
   * @param  {String}             url     URI string to append to baseURL.
   * @param  {{String : Sting}}   headers headers to append the baseHeaders
   * @param  {Any}                body    body to send in request
   * @return {Promise}                    promise object to be fulfilled in request
   */
  patch(url, headers, body) {
    return this.fetch({
      method: Method.PATCH,
      url: url,
      headers: headers,
      body: body
    });
  }

  /**
   * DELETE requester method
   * @param  {String}             url     URI string to append to baseURL.
   * @param  {{String : Sting}}   headers headers to append the baseHeaders
   * @return {Promise}                    promise object to be fulfilled in request
   */
  delete(url, headers) {
    return this.fetch({
      method: Method.DELETE,
      url: url,
      headers: headers
    });
  }

  /**
   * FETCH requester method
   * @param  {Object} request parameters for fetch request
   * @return {Promise} promise object to be fulfilled in request
   */
  fetch(request) {
    const { url, headers } = request;

    request.url = `${this.baseURL}${url}`;
    if (headers) {
      request.headers = Object.assign(this.baseHeaders, headers);
    }

    httpSession(this.xhr, request)
      .then(res => {
        this._handleSuccess(res);
        return Promise.resolve(res);
      })
      .catch(e => {
        this._handleError(e);
        return Promise.reject(e);
      });
  }

  /**
   * EVENT HANDLER METHODS
   */

  /**
   * [onError description]
   * @param  {Function} cb  Callback function that executes on request calls error
   * @return {Http}        Current Http Object
   */
  onError(cb) {
    return this._applyCallback('onError', cb);
  }

  /**
   * [onSuccess description]
   * @param  {Function} cb  Callback function that executes on request calls successes
   * @return {Http}        Current Http Object
   */
  onSuccess(cb) {
    return this._applyCallback('onSuccess', cb);
  }

  /**
   * Internal Methods
   * @param  {String} key  Name of listener
   * @param  {Function} cb  Callback function that executes on request calls successes
   * @return {Http}        Current Http Object
   */
  _applyCallback(key, cb) {
    if (typeof cb === 'function') {
      this._callbacks[key] = e => cb(e);
    }

    return this;
  }

  _handleError(e) {
    const cb = this._callbacks.onError;

    if (cb) {
      return cb(e);
    }
  }

  _handleSuccess(e) {
    const cb = this._callbacks.onSuccess;

    if (cb) {
      return cb(e);
    }
  }
}

export {
  Http,
  Method
};
