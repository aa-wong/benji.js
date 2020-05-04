/*!
 * benji
 * Benji is a lightweight HTTP networking library for managing simple HTTP requests in Javascript.
 * 
 * @version v1.0.0
 * @author Aaron Wong <aaron@pixelbirddesign.com>
 * @homepage https://github.com/aa-wong/benji.js
 * @repository git+https://github.com/aa-wong/benji.js.git
 */
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src */ "./src/index.js").default;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: Http, Method */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Http", function() { return Http; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Method", function() { return Method; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Method = Object.freeze({
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

var httpSession = function httpSession(xhr, request) {
  var method = request.method,
      url = request.url,
      headers = request.headers,
      body = request.body;

  if (!(method in Method)) {
    return Promise.reject(new Error('Invalid method supplied.'));
  }

  var successCode = !body ? Method._.successCodes[method] : Method._.createSuccess[method];
  xhr.open(method || Method.GET, url, true);

  if (headers && headers.constructor === Object) {
    for (var key in headers) {
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

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var res;

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

var Http = /*#__PURE__*/function () {
  /**
   * Constructor Method
   * @param {Object} options options to apply on initialization
   */
  function Http() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Http);

    this._ = {};
    Object.keys(options).forEach(function (prop) {
      return _this._[prop] = options[prop];
    });
    this._callbacks = {};
  }
  /**
   * PROPERTIES
   */

  /**
   * Base URL Getter
   * @return {String} baseURL string
   */


  _createClass(Http, [{
    key: "get",

    /**
     * REQUEST METHODS
     */

    /**
     * GET requester method
     * @param  {String}             url     URI string to append to baseURL.
     * @param  {{String : Sting}}   headers headers to append the baseHeaders
     * @return {Promise}            promise object to be fulfilled in request
     */
    value: function get(url, headers) {
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

  }, {
    key: "post",
    value: function post(url, headers, body) {
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

  }, {
    key: "put",
    value: function put(url, headers, body) {
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

  }, {
    key: "patch",
    value: function patch(url, headers, body) {
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

  }, {
    key: "delete",
    value: function _delete(url, headers) {
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

  }, {
    key: "fetch",
    value: function fetch(request) {
      var _this2 = this;

      var url = request.url,
          headers = request.headers;
      request.url = "".concat(this.baseURL).concat(url);

      if (headers) {
        request.headers = Object.assign(this.baseHeaders, headers);
      }

      httpSession(this.xhr, request).then(function (res) {
        _this2._handleSuccess(res);

        return Promise.resolve(res);
      }).catch(function (e) {
        _this2._handleError(e);

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

  }, {
    key: "onError",
    value: function onError(cb) {
      return this._applyCallback('onError', cb);
    }
    /**
     * [onSuccess description]
     * @param  {Function} cb  Callback function that executes on request calls successes
     * @return {Http}        Current Http Object
     */

  }, {
    key: "onSuccess",
    value: function onSuccess(cb) {
      return this._applyCallback('onSuccess', cb);
    }
    /**
     * Internal Methods
     * @param  {String} key  Name of listener
     * @param  {Function} cb  Callback function that executes on request calls successes
     * @return {Http}        Current Http Object
     */

  }, {
    key: "_applyCallback",
    value: function _applyCallback(key, cb) {
      if (typeof cb === 'function') {
        this._callbacks[key] = function (e) {
          return cb(e);
        };
      }

      return this;
    }
  }, {
    key: "_handleError",
    value: function _handleError(e) {
      var cb = this._callbacks.onError;

      if (cb) {
        return cb(e);
      }
    }
  }, {
    key: "_handleSuccess",
    value: function _handleSuccess(e) {
      var cb = this._callbacks.onSuccess;

      if (cb) {
        return cb(e);
      }
    }
  }, {
    key: "baseURL",
    get: function get() {
      return !this._.baseURL ? '' : this._.baseURL;
    }
    /**
     * Base URL Setter
     * @param  {String} url string argument to set as baseURL property
     */
    ,
    set: function set(url) {
      if (url && url.constructor === String) {
        this._.baseURL = url;
      }
    }
    /**
     * Base Headers Getter
     * @return {{String : Sting}} baseHeaders object
     */

  }, {
    key: "baseHeaders",
    get: function get() {
      return !this._.baseHeaders ? {} : this._.baseHeaders;
    }
    /**
     * Base Headers Setter
     * @param  {{String : Sting}} headers object argument to set as baseHeaders property
     */
    ,
    set: function set(headers) {
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

  }, {
    key: "xhr",
    get: function get() {
      if (!this._.xhr) {
        this._.xhr = new XMLHttpRequest();
      }

      return this._.xhr;
    }
    /**
     * XMLHttpRequest Setter
     * @param  {XMLHttpRequest} xhr XMLHttpRequest object to set as xhr property
     */
    ,
    set: function set(xhr) {
      if (xhr && xhr.constructor === XMLHttpRequest) {
        this._.xhr = xhr;
      }
    }
  }]);

  return Http;
}();



/***/ })

/******/ });
//# sourceMappingURL=benji.js.map