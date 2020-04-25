![Benji - Developer's Best Friend in Fetch Requests](https://raw.githubusercontent.com/aa-wong/Benji/master/Benji.js-logo.png)

Benji is a lightweight HTTP networking library for managing simple HTTP requests in Javascript.

## Philosophy

A simple interface for making RESTful HTTP requests.

## Installation

### npm

### Manually

If you prefer not to use any of the aforementioned dependency managers, you can integrate Benji into your project manually. Use the benji.min.js file found in the lib directory.

## API Documentation

### Create Instance
Import the framework into the file you wish to use in or reference it in window.
```js
import {
  Benji,
  benjiMethod
} from './benji.min.js';
```

Regular initialization
```js
const benji = new Benji();

const benji = new window.benji.Benji();
```
### Base parameters
Base parameters can be set per instance to be used for all requests made by Benij.

optional baseURL parameter takes in a string URL to be a referenced for all calls with concatenated URIs.
```js
benji.baseURL = "https://api.<domain>.com/v2"
```

optional baseHeaders parameter takes in a dictionary of header parameters to be applied to all http requests.
```js
benji.baseHeaders = {'<header Key>' : '<header value>'}
```

### HTTP Requests
All HTTP request methods below. Each method contains a callback with optional parameters that will return if they are available.
If baseURL is set, applied url strings to the methods below will append to the baseURL.

baseURL + applied url

if baseHeaders are set, any headers that are applied to the methods below will be appended to the baseHeaders for the request.

Requests supports async-await, promises or event listeners.

```js
// GET
try {
    const res = await benji.GET('<uri>', { '<header Key>' : '<header value>' });
    console.log(res);
} catch(e) {
    console.error(e);
}

// POST
benji.POST('<uri>', { '<header Key>' : '<header value>' }, '< Body >')
  .then(console.log)
  .catch(console.error);

// PUT
const res = await benji.PUT('<uri>', { '<header Key>' : '<header value>' }, '< Body >').catch(console.error);
console.log(res);

// PATCH
benji.PATCH('<uri>', { '<header Key>' : '<header value>' }, '< Body >')
  .then(console.log)
  .catch(console.error);

// DELETE
benji.DELETE('<uri>', { '<header Key>' : '<header value>' })
    .then(console.log)
    .catch(console.error);
```

FETCH is a super function that is an alternative way to execute all the requests above. All that is required is to apply the appropriate requestType.

```js

const type = benjiMethod.GET;

try {
    const res = await benji.FETCH(type, '<uri>', { '<header Key>' : '<header value>' }, '< Body >');
    console.log(res);
} catch(e) {
    console.error(e);
}
```

### HTTP Request Event Handlers
All request methods support event listeners that will executing appropriately with each requests.

```js

benji
  .onError(console.error)
  .onSuccess(console.log);

```
