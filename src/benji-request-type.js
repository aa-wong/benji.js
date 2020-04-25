'use strict';

export default Object.freeze({
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
